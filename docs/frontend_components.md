# NextGen Electronics – Frontend Component Guide

This guide documents all _public_ React components and pages contained in the `frontend/` folder.  
It should give new contributors a quick, hands-on reference complete with live code snippets.

---

## Conventions

* UI atoms/molecules live in `src/components/ui/`
* Page-level containers live in `src/`
* Tailwind CSS is used for utility-first styling, while Material-UI (MUI) provides battle-tested primitives.  
  Every `Ui*` component wraps an MUI primitive and injects a NextGen-flavoured theme.

> **Tip**: All props not explicitly documented are forwarded to the underlying MUI component, so you keep full power & flexibility.

---

## 1. UI Components

### 1.1 `UiButton`

* **Path**: `src/components/ui/UiButton.jsx`
* **Description**: Opinionated wrapper around MUI `Button` adding rounded corners, bold typography and smooth shadows.

| Prop       | Type   | Default | Description                                 |
|------------|--------|---------|---------------------------------------------|
| `children` | node   | —       | Button label (text / icon / element).       |
| `className`| string | ""      | Additional Tailwind classes.                |
| `sx`       | object | `{}`    | Extra MUI `sx` overrides.                   |
| `…rest`    | any    | —       | All other MUI `Button` props.               |

**Example**
```jsx
import UiButton from "@/components/ui/UiButton";

function SaveBtn() {
  return (
    <UiButton variant="contained" color="primary" onClick={() => alert('Saved!')}>
      Save
    </UiButton>
  );
}
```

---

### 1.2 `UiCard`

* **Path**: `src/components/ui/UiCard.jsx`
* **Description**: Simple card with 16-pixel radius and subtle hover elevation.

| Prop       | Type   | Default | Description              |
|------------|--------|---------|--------------------------|
| `children` | node   | —       | Card content.            |
| `className`| string | ""      | Tailwind utility classes |
| `…rest`    | any    | —       | All other MUI `Card` props|

**Example**
```jsx
<UiCard className="max-w-sm">
  <p className="text-gray-600 text-sm">Hello from Card 👋</p>
</UiCard>
```

---

### 1.3 `UiDialog`

* **Path**: `src/components/ui/UiDialog.jsx`
* **Description**: Medium-sized dialog with custom radius/shadow, built on MUI `Dialog`.

| Prop        | Type | Required | Description                                             |
|-------------|------|----------|---------------------------------------------------------|
| `open`      | bool | ✔        | Whether the dialog is visible.                          |
| `onClose`   | func | ✔        | Handles backdrop click / ESC press.                     |
| `title`     | node | —        | Optional headline rendered in bold.                     |
| `children`  | node | —        | Main dialog body.                                       |
| `actions`   | node | —        | Optional footer (usually buttons inside `DialogActions`).|

**Example**
```jsx
<UiDialog
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm deletion"
  actions={(
    <>
      <UiButton onClick={() => setOpen(false)}>Cancel</UiButton>
      <UiButton color="error" onClick={handleDelete}>Delete</UiButton>
    </>
  )}
>
  <p>Are you sure you want to delete this item?</p>
</UiDialog>
```

---

### 1.4 `UiTextField`

* **Path**: `src/components/ui/UiTextField.jsx`
* **Description**: Rounded input field with brand-coloured focus ring.

| Prop       | Type   | Default | Description             |
|------------|--------|---------|-------------------------|
| `className`| string | ""      | Additional Tailwind classes. |
| `…rest`    | any    | —       | All other MUI `TextField` props.

**Example**
```jsx
<UiTextField
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
```

---

## 2. Pages & Containers

Page components live directly in `src/` and map 1-to-1 to React Router routes.

| Component       | Path                 | Purpose & Main API Calls                           | Critical Props |
|-----------------|----------------------|----------------------------------------------------|----------------|
| `App`           | `src/App.jsx`        | Defines router tree, holds shared layout           | —              |
| `Home`          | `src/Home.jsx`       | Lists products via `GET /api/products`             | —              |
| `Cart`          | `src/Cart.jsx`       | Manages shopping cart (localStorage)               | —              |
| `LoginForm`     | `src/LoginForm.jsx`  | Authenticates user with `POST /api/auth/login`     | `onLogin`      |
| `SignupForm`    | `src/SignupForm.jsx` | Registers user with `POST /api/auth/signup`        | —              |
| `AddProduct`    | `src/AddProduct.jsx` | Admin-only product creation + image upload         | —              |
| `ManageUsers`   | `src/ManageUsers.jsx`| Admin CRUD for users using `/api/users` endpoints  | `token`        |

### 2.1 `AddProduct` Deep Dive

`AddProduct` performs a two-step flow:
1. **Image upload** – `POST /api/products/upload-image` (multipart), returns an `imageUrl`.
2. **Product creation** – `POST /api/products` (JSON body containing `images: [imageUrl]`).

The component expects the JWT to be stored in `localStorage` under the key `token`.

```jsx
<Route path="/admin/add-product" element={<AddProduct />} />
```

### 2.2 `ManageUsers`

`ManageUsers` is an admin dashboard to view, add, edit, and delete users.  
Pass the JWT as a prop so it can be used in `fetch` calls.

```jsx
<ManageUsers token={jwt} />
```

---

## 3. Styling & Theming

* **Tailwind** config: `tailwind.config.js`
* **Global styles**: `src/index.css`
* **Material-UI** is imported on demand — the project currently uses MUI v5 via `@mui/material`.

---

## 4. Contributing Checklist

1. **Add / Update component** in the appropriate folder.
2. **Write / update unit tests** (if present).
3. **Update this document** with props & usage examples.
4. **Run linter & dev server** to confirm component renders correctly:
   ```bash
   cd frontend && npm run dev
   ```

Happy hacking! ⚡