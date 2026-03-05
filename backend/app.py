from flask import Flask, request, jsonify, current_app
from flask_cors import CORS
from model import db, Issue
from datetime import datetime
import math
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///issues.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configure CORS to allow all origins for development
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:4200", "http://127.0.0.1:4200"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

db.init_app(app)

def create_tables():
    db.create_all()
    
    # Add sample data if no issues exist
    if Issue.query.count() == 0:
        sample_issues = [
            Issue(title="Login bug", description="Users cannot login", status="Open", priority="High", assignee="john.doe@example.com"),
            Issue(title="UI improvements", description="Improve dashboard UI", status="In Progress", priority="Medium", assignee="jane.smith@example.com"),
            Issue(title="Performance optimization", description="Optimize database queries", status="Closed", priority="Low", assignee="bob.johnson@example.com"),
            Issue(title="Feature request", description="Add export functionality", status="Open", priority="High", assignee="alice.brown@example.com"),
            Issue(title="Documentation update", description="Update API documentation", status="In Progress", priority="Low", assignee="charlie.wilson@example.com"),
        ]
        
        for issue in sample_issues:
            db.session.add(issue)
        db.session.commit()

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    current_app.logger.info('Health check endpoint called')
    return jsonify({"status": "ok", "message": "API is running"})

# Get all issues with optional filtering and pagination
@app.route('/api/issues', methods=['GET'])
def get_issues():
    try:
        current_app.logger.info('GET /api/issues endpoint called')
        # Get query parameters
        search = request.args.get('search', '')
        status = request.args.get('status')
        priority = request.args.get('priority')
        assignee = request.args.get('assignee')
        sort_by = request.args.get('sortBy', 'created_at')
        sort_order = request.args.get('sortOrder', 'desc')
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('pageSize', 10))

        # Build query
        query = Issue.query

        # Apply filters
        if search:
            query = query.filter(
                (Issue.title.ilike(f'%{search}%')) |
                (Issue.description.ilike(f'%{search}%'))
            )
        if status:
            query = query.filter_by(status=status)
        if priority:
            query = query.filter_by(priority=priority)
        if assignee:
            query = query.filter_by(assignee=assignee)

        # Apply sorting
        sort_column = getattr(Issue, sort_by, Issue.created_at)
        if sort_order.lower() == 'desc':
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())

        # Pagination
        paginated_issues = query.paginate(page=page, per_page=page_size, error_out=False)

        # Prepare response
        response = {
            'data': [issue.to_dict() for issue in paginated_issues.items],
            'pagination': {
                'page': paginated_issues.page,
                'pageSize': paginated_issues.per_page,
                'total': paginated_issues.total,
                'totalPages': paginated_issues.pages
            }
        }

        current_app.logger.info(f'Successfully fetched {len(response["data"])} issues')
        return jsonify(response)
    except Exception as e:
        current_app.logger.error(f'Error fetching issues: {str(e)}')
        return jsonify({"error": "Failed to fetch issues"}), 500

# Get a single issue by ID
@app.route('/api/issues/<string:issue_id>', methods=['GET'])
def get_issue(issue_id):
    try:
        issue = Issue.query.get_or_404(issue_id)
        return jsonify(issue.to_dict())
    except Exception as e:
        current_app.logger.error(f'Error fetching issue {issue_id}: {str(e)}')
        return jsonify({"error": "Failed to fetch issue"}), 500

# Create a new issue
@app.route('/api/issues', methods=['POST'])
def create_issue():
    try:
        data = request.get_json()
        current_app.logger.info(f'Creating new issue: {data}')
        
        # Validate required fields
        required_fields = ['title', 'description', 'status', 'priority']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Create new issue
        issue = Issue(
            title=data['title'],
            description=data['description'],
            status=data['status'],
            priority=data['priority'],
            assignee=data.get('assignee', '')
        )
        
        db.session.add(issue)
        db.session.commit()
        
        return jsonify(issue.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error creating issue: {str(e)}')
        return jsonify({"error": "Failed to create issue"}), 500

# Update an existing issue
@app.route('/api/issues/<string:issue_id>', methods=['PUT'])
def update_issue(issue_id):
    try:
        issue = Issue.query.get_or_404(issue_id)
        data = request.get_json()
        current_app.logger.info(f'Updating issue {issue_id}: {data}')
        
        # Update fields if provided
        if 'title' in data:
            issue.title = data['title']
        if 'description' in data:
            issue.description = data['description']
        if 'status' in data:
            issue.status = data['status']
        if 'priority' in data:
            issue.priority = data['priority']
        if 'assignee' in data:
            issue.assignee = data['assignee']
        
        issue.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(issue.to_dict())
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error updating issue {issue_id}: {str(e)}')
        return jsonify({"error": "Failed to update issue"}), 500

if __name__ == '__main__':
    try:
        logger.info('Starting application...')
        with app.app_context():
            logger.info('Creating database tables...')
            create_tables()
        
        # Print all registered routes for debugging
        logger.info('Registered routes:')
        for rule in app.url_map.iter_rules():
            logger.info(f"{rule.endpoint}: {rule.rule} {list(rule.methods)}")
        
        logger.info('Starting Flask development server...')
        logger.info(f'Server will be available at http://localhost:5000')
        
        # Run the server with explicit host and port
        from werkzeug.serving import run_simple
        run_simple('0.0.0.0', 5000, app, use_reloader=False, use_debugger=True, threaded=True)
        
    except Exception as e:
        logger.error(f'Failed to start server: {str(e)}')
        raise
