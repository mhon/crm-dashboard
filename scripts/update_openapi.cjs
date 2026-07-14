const fs = require('fs');
const path = require('path');

const openapiPath = path.join(__dirname, '../lib/api-spec/openapi.yaml');
let content = fs.readFileSync(openapiPath, 'utf-8');

// 1. Add tags
const tagsAnchor = `  - name: dashboard
    description: Dashboard summary operations`;
const tagsToAdd = `
  - name: companies
    description: Company operations
  - name: leads
    description: Lead operations
  - name: tasks
    description: Task operations`;
content = content.replace(tagsAnchor, tagsAnchor + tagsToAdd);

// 2. Add schemas at the end
const schemasToAdd = `
    Company:
      type: object
      required: [id, name, created_at]
      properties:
        id:
          type: string
        name:
          type: string
        domain:
          type: ["string", "null"]
        industry:
          type: ["string", "null"]
        created_at:
          type: string

    CompanyInput:
      type: object
      required: [name]
      properties:
        name:
          type: string
          minLength: 1
        domain:
          type: ["string", "null"]
        industry:
          type: ["string", "null"]

    Lead:
      type: object
      required: [id, name, email, status, created_at]
      properties:
        id:
          type: string
        company_id:
          type: ["string", "null"]
        name:
          type: string
        email:
          type: string
        phone:
          type: ["string", "null"]
        status:
          type: string
        ai_score:
          type: ["integer", "null"]
        created_at:
          type: string

    LeadInput:
      type: object
      required: [name, email]
      properties:
        company_id:
          type: ["string", "null"]
        name:
          type: string
          minLength: 1
        email:
          type: string
          minLength: 1
        phone:
          type: ["string", "null"]
        status:
          type: string

    Task:
      type: object
      required: [id, title, status, created_at]
      properties:
        id:
          type: string
        title:
          type: string
        description:
          type: ["string", "null"]
        due_date:
          type: ["string", "null"]
        status:
          type: string
        related_lead_id:
          type: ["string", "null"]
        related_customer_id:
          type: ["string", "null"]
        assigned_to:
          type: ["string", "null"]
        created_at:
          type: string

    TaskInput:
      type: object
      required: [title]
      properties:
        title:
          type: string
          minLength: 1
        description:
          type: ["string", "null"]
        due_date:
          type: ["string", "null"]
        status:
          type: string
        related_lead_id:
          type: ["string", "null"]
        related_customer_id:
          type: ["string", "null"]
        assigned_to:
          type: ["string", "null"]
`;
content += schemasToAdd;

// 3. Add paths
const pathsAnchor = `  /dashboard/order-status-breakdown:
    get:
      operationId: getOrderStatusBreakdown
      tags: [dashboard]
      summary: Get order counts by status
      responses:
        "200":
          description: Breakdown
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/OrderStatusBreakdown"`;

const pathsToAdd = `

  /companies:
    get:
      operationId: listCompanies
      tags: [companies]
      summary: List all companies
      responses:
        "200":
          description: List of companies
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Company"
    post:
      operationId: createCompany
      tags: [companies]
      summary: Create a company
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CompanyInput"
      responses:
        "201":
          description: Created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Company"

  /companies/{id}:
    get:
      operationId: getCompany
      tags: [companies]
      summary: Get a company
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Company
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Company"
        "404":
          description: Not found

  /leads:
    get:
      operationId: listLeads
      tags: [leads]
      summary: List all leads
      responses:
        "200":
          description: List of leads
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Lead"
    post:
      operationId: createLead
      tags: [leads]
      summary: Create a lead
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/LeadInput"
      responses:
        "201":
          description: Created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Lead"

  /leads/{id}:
    get:
      operationId: getLead
      tags: [leads]
      summary: Get a lead
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Lead
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Lead"
        "404":
          description: Not found
    patch:
      operationId: updateLead
      tags: [leads]
      summary: Update a lead
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/LeadInput"
      responses:
        "200":
          description: Updated
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Lead"

  /tasks:
    get:
      operationId: listTasks
      tags: [tasks]
      summary: List all tasks
      responses:
        "200":
          description: List of tasks
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Task"
    post:
      operationId: createTask
      tags: [tasks]
      summary: Create a task
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/TaskInput"
      responses:
        "201":
          description: Created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Task"

  /tasks/{id}:
    get:
      operationId: getTask
      tags: [tasks]
      summary: Get a task
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Task
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Task"
        "404":
          description: Not found
    patch:
      operationId: updateTask
      tags: [tasks]
      summary: Update a task
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/TaskInput"
      responses:
        "200":
          description: Updated
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Task"
`;

content = content.replace(pathsAnchor, pathsAnchor + pathsToAdd);

fs.writeFileSync(openapiPath, content);
console.log('Successfully updated openapi.yaml');
