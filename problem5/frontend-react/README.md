# Frontend React

Scaffolded React + Vite project with CSS, example Hooks and Redux (Redux Toolkit).


## API Integration

The project is configured to fetch data from a backend API at `http://localhost:5000/api`.

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
