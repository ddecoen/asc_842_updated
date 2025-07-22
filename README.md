# ASC 842 Lease Accounting - Enhanced

A comprehensive ASC 842 lease accounting application with advanced features for variable payments, pre-ASC 842 tracking, and sublease management. **Supports flexible payment terms that can span calendar years** (e.g., 7/1/25 to 6/30/26), accommodating any lease structure from traditional calendar years to complex multi-year periods. Built with Next.js 15, TypeScript, and modern web technologies.


## 🚀 Features

### Core ASC 842 Functionality
- ✅ **ASC 842 compliant lease calculations** - Full present value and amortization calculations
- ✅ **Automated journal entry generation** - Complete debit/credit entries for lease accounting
- ✅ **Right-of-use asset tracking** - Asset amortization over lease term
- ✅ **Lease liability management** - Interest and principal payment tracking

### Advanced Payment Structures
- ✅ **Calendar year spanning payment terms** - Set up lease payments that span across calendar years (e.g., 7/1/25 to 6/30/26)
- ✅ **Variable lease payments** - Flexible payment schedules with automatic increases
- ✅ **Fixed payment support** - Traditional monthly payment structures
- ✅ **Multi-year lease terms** - Support for lease periods spanning multiple years
- ✅ **Payment period flexibility** - Specify exact start/end dates for any payment period
- ✅ **Present value calculations** - Accurate NPV for variable payment streams

### Pre-ASC 842 Tracking
- ✅ **Historical payment records** - Track payments made before ASC 842 adoption
- ✅ **ASC 842 adoption date** - Mark transition date for accounting standards
- ✅ **Payment categorization** - Security deposits, prepaid rent, initial costs
- ✅ **Total payment summaries** - Comprehensive pre-adoption payment totals

### Comprehensive Sublease Management
- ✅ **Multiple sublease tracking** - Support for multiple subleases per lease
- ✅ **Sublease income calculation** - Automatic monthly income recognition
- ✅ **Period-based income** - Income only during active sublease periods
- ✅ **Security deposit tracking** - Sublease security deposit management
- ✅ **Integrated journal entries** - Sublease income in monthly accounting entries

### User Experience
- ✅ **No authentication required** - Direct access to lease management
- ✅ **Responsive design** - Works on desktop, tablet, and mobile
- ✅ **Dynamic forms** - Add/remove payment schedules, pre-ASC 842 payments, and subleases
- ✅ **Visual indicators** - Clear payment structure and sublease status displays
- ✅ **Comprehensive lease details** - Complete lease information in organized sections

## 🛠 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Build for Production

```bash
npm run build
npm start
```

## 🗓️ Calendar Year Spanning Payment Terms

This application excels at handling **payment terms that span across calendar years**, making it perfect for:

### Common Scenarios:
- **Fiscal year leases** - July 1st to June 30th payment periods
- **Academic year leases** - September to August terms
- **Seasonal businesses** - Custom periods aligned with business cycles
- **Multi-year agreements** - Long-term leases with varying payment schedules

### Key Benefits:
- ✅ **Flexible date ranges** - Set any start and end dates (e.g., 7/1/25 to 6/30/26)
- ✅ **Automatic calculations** - Proper present value calculations across date boundaries
- ✅ **ASC 842 compliance** - Accurate accounting regardless of payment period structure
- ✅ **Real-world alignment** - Match your actual lease terms, not forced calendar years

## 📊 Usage Examples
### Calendar Year Spanning Payment Terms
Lease Term: July 1, 2025 to June 30, 2028
Period 1: 7/1/25 to 6/30/26 - $8,000/month (Year 1)
Period 2: 7/1/26 to 6/30/27 - $8,400/month (Year 2 - 5% increase)
Period 3: 7/1/27 to 6/30/28 - $8,820/month (Year 3 - 5% increase)

### Variable Payment Lease
```
Year 1: $5,000/month
Year 2: $5,250/month (5% increase)
Year 3: $5,500/month (5% increase)
```

### Sublease Scenario
```
Main Lease: $10,000/month
Sublease A: $3,000/month (Jan 2024 - Dec 2025)
Sublease B: $2,000/month (Jun 2024 - Dec 2024)
Net Cost: $5,000/month (when both subleases active)
```

### Pre-ASC 842 Payments
```
Security Deposit: $20,000 (paid before adoption)
First Month Rent: $10,000 (paid before adoption)
ASC 842 Adoption: January 1, 2024
```

## 🏗 Architecture

### Data Storage
- **In-memory storage** - Simple demo-ready data persistence
- **No external dependencies** - Runs without database setup
- **Session-based** - Data persists during application session

### API Endpoints
- `GET /api/leases` - Retrieve all leases
- `POST /api/leases` - Create new lease with full feature support
- `GET /api/journal-entries?leaseId=xxx` - Generate journal entries for lease

### Tech Stack
- **Next.js 15** with App Router and Turbopack
- **TypeScript** for comprehensive type safety
- **TailwindCSS** for modern, responsive styling
- **Zod** for robust data validation
- **React 19** with modern hooks and patterns

## 📋 Lease Management Features

### Payment Structure Options
1. **Fixed Monthly Payment** - Traditional lease structure
2. **Variable Payment Schedule** - Year-based payment changes

### Sublease Management
1. **Add Multiple Subleases** - Track multiple sublease arrangements
2. **Income Period Tracking** - Automatic start/end date management
3. **Security Deposit Tracking** - Separate sublease deposit management
4. **Description Fields** - Custom notes for each sublease

### Pre-ASC 842 Tracking
1. **Historical Payments** - Record payments before standard adoption
2. **Payment Descriptions** - Categorize payment types
3. **Adoption Date Marking** - Clear transition point identification
4. **Total Summaries** - Comprehensive pre-adoption payment totals

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Other Platforms
The application is a standard Next.js app and can be deployed to:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify
- Any Node.js hosting provider

## 🔧 Development

### Project Structure
```
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── Dashboard.tsx   # Main dashboard
│   └── LeaseForm.tsx   # Lease creation form
├── lib/               # Utilities and types
│   ├── calculations.ts # ASC 842 calculations
│   ├── types.ts       # TypeScript definitions
│   └── validation.ts  # Zod schemas
└── public/           # Static assets
```

### Key Components
- **Dashboard** - Main interface with lease list and details
- **LeaseForm** - Comprehensive form with all feature support
- **Calculations** - ASC 842 compliant calculation engine
- **Types** - Complete TypeScript definitions
- **Validation** - Robust input validation schemas

## 📈 ASC 842 Compliance

This application implements ASC 842 lease accounting standards including:
- Present value calculations for lease liabilities
- Right-of-use asset recognition and amortization
- Interest expense calculation on lease liabilities
- Proper journal entry generation for monthly accounting
- Support for variable lease payments
- Sublease income recognition
- Historical payment tracking for transition periods

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is open source and available under the MIT License.
