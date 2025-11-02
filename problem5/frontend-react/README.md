# Frontend React

Scaffolded React + Vite project with CSS, example Hooks and Redux (Redux Toolkit).

## Quick Start

From PowerShell:

```powershell
cd d:\TechZen\frontend-react
npm install
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Modal.jsx    # Modal dialog with overlay
│   │   ├── Table.jsx    # Data table with sorting & pagination
│   │   ├── Toast.jsx    # Toast notification system
│   │   └── Menu.jsx     # Navigation menu component
│   └── layout/          # Layout components
│       ├── Header.jsx   # Site header with navigation
│       └── Footer.jsx   # Site footer
├── pages/
│   ├── Homepage.jsx     # Main homepage with demos
│   └── Products.jsx     # Products page with API integration
├── hooks/               # Custom React hooks
│   ├── useWindowSize.js
│   └── useFetch.js
├── redux/               # Redux Toolkit setup
│   ├── store.js
│   └── slices/
│       ├── exampleSlice.js
│       └── toastSlice.js
├── config/              # Configuration files
│   └── api.js           # API endpoints configuration
└── styles/              # Global styles
    └── global.css
```

## API Integration

The project is configured to fetch data from a backend API at `http://localhost:3000/api`.

### Products API

**Endpoint:** `GET http://localhost:3000/api/products`

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Product A",
    "category": "Electronics",
    "price": "$123",
    "stock": 50,
    "createdAt": "2025-11-02T06:20:10.000Z",
    "updatedAt": "2025-11-02T06:20:10.000Z"
  }
]
```

**Configuration:** API endpoints are configured in `src/config/api.js`

**Usage:** The `Products.jsx` page uses the `useFetch` hook to fetch and display products in a table with:
- Loading state
- Error handling
- Auto-refresh capability
- Product statistics (total, low stock, categories)
- Sortable columns
- Pagination

## Available Components

### Modal
Reusable modal dialog with overlay, ESC key support, and click-outside-to-close.

```jsx
import Modal from './components/common/Modal'

<Modal isOpen={isOpen} onClose={handleClose} title="My Modal" size="medium">
  <p>Modal content here</p>
</Modal>
```

### Table
Data table with sorting and pagination support.

```jsx
import Table from './components/common/Table'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
]

<Table columns={columns} data={data} sortable pagination pageSize={10} />
```

### Toast Notifications
Auto-dismissing toast notifications with Redux integration.

```jsx
import { useDispatch } from 'react-redux'
import { addToast } from './redux/slices/toastSlice'

const dispatch = useDispatch()
dispatch(addToast({ 
  message: 'Success!', 
  type: 'success',  // success, error, warning, info
  duration: 3000 
}))
```

### Header & Footer
Pre-built layout components with responsive design.

### Menu
Flexible navigation menu with horizontal/vertical orientation and active states.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Next Steps

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open browser to the local URL (typically http://localhost:5173)
4. Customize components in `src/components/`
5. Add new pages in `src/pages/`
6. Extend Redux slices in `src/redux/slices/`
