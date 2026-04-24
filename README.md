# Resume Studio - Cloud Deployment Guide

A fully deployable Resume Generator Web Application designed for a complete Cloud Architecture matching Experiment-10 standards.

## Cloud Architecture & Setup Instructions

Follow these 6 steps to deploy this application to the cloud, configure high availability, scaling, databases, and object storage:

### Step 1: Set Up Cloud Service Account
1. Choose a cloud provider (e.g., AWS, Google Cloud, or Azure).
2. Sign up for a free-tier eligible account.
3. Verify your account (email and identity).

### Step 2: Create and Configure Virtual Machine (VM)
1. Log in to the cloud console (e.g., AWS EC2, Google Compute Engine, or Azure Virtual Machines).
2. Create a new VM instance with a basic OS (Ubuntu 22.04 LTS or Windows Server).
3. Set up an Elastic/Static IP for the VM.
4. Configure security groups/firewall rules to allow:
    - **SSH (Port 22)** for server management
    - **HTTP (Port 80)** for web traffic
    - **HTTPS (Port 443)** for secure web traffic
    - **Node.js Server Port (Port 3000)** (optional)

### Step 3: Deploy a Basic Web Application
This web application is built on HTML/JavaScript/CSS and powered by an **Express framework for Node.js**.
1. Install a web server locally or on the VM (e.g., Apache, Nginx).
2. Use the provided Node.js application (\`server.js\`) containing Express endpoints.
3. Upload the project code to your VM instance using SSH or an SFTP client like FileZilla:
   \`\`\`bash
   scp -i "your-key.pem" -r ./ecosystem ubuntu@your-vm-ip:/home/ubuntu/
   \`\`\`
4. Install dependencies and start the app:
   \`\`\`bash
   npm install
   npm start
   \`\`\`
5. Test the web application by navigating to your VM's public IP address in a web browser.

### Step 4: Set Up Object Storage
For storing generated PDF files, profiles, and templates:
1. Choose a cloud storage service (AWS S3, Google Cloud Storage, or Azure Blob Storage).
2. Create a bucket/container to store the files (e.g., \`resume-studio-assets\`).
3. Manage files through the cloud console.
4. Set basic access control: make specific template files public and keep generated PDFs private.
*(Note: A placeholder for object storage upload exists in \`server.js\` under the \`/api/upload\` endpoint).*

### Step 5: Use Database as a Service (DBaaS)
To store persistent user profiles, saved resume data, and form drafts:
1. Set up a managed database service (e.g., AWS RDS, Google Cloud SQL, or Azure SQL).
2. Create a new Database (e.g., MySQL 8.x or PostgreSQL 14).
3. Whitelist your VM's IP address within the Database Security Group.
4. Connect your web application to the DBaaS:
   - Provide the Endpoint, DB Name, User, and Password via environment variables.
*(Note: DB connection placeholders and CRUD endpoints like \`/api/users\` are ready inside \`server.js\`).*

### Step 6: Scaling and Load Balancing (Experiment-10)
To ensure the Resume Studio web app remains highly available under heavy traffic:
1. **Implement Auto-Scaling:**
   - Create an Auto Scaling Group (ASG) or an Instance Template based on your original configured VM.
   - Set up dynamic scaling policies to add/remove VM instances automatically based on CPU utilization > 70%.
2. **Set up a Load Balancer (ALB / ELB):**
   - Deploy a load balancer to distribute incoming traffic evenly between multiple backend instances.
   - Configure health checks to ping the \`/health\` endpoint (already provided in \`server.js\`). Only healthy instances will receive new web traffic.

