# **App Name**: ConstruFacil

## Core Features:

- CUB Input and Persistence: Allows the user to input the CUB value and persists it locally using localStorage.
- Dynamic Averbação Table: Dynamically generate a table of averbações with columns for type, area (before and after), calculated value, and actions.
- Averbação Type Selection: Dropdown to select the type of averbação (Construção Nova or Acréscimo).
- Area Input: Input fields for 'Área Anterior' (only enabled if the type is Acréscimo) and 'Área Atual'.
- Automatic Calculation: Automatically calculate the 'Valor Calculado' based on the inputs using the selected type.
- Copy Individual Value: Adds an individual copy button per line so the value can be copied to clipboard.
- Help Page with Visual Guide: Includes an easy to follow step by step help page including visual indicators that shows users the main functionality of the calculator.

## Style Guidelines:

- Primary color: Green (#4CAF50) for 'Salvar CUB' button, conveying stability.
- Background color: White (#FFFFFF) to provide a clean interface.
- Accent color: Orange (#FF9800) for the 'Copiar Valor Final' button.
- Font: 'Inter' sans-serif, with semi-bold/bold for titles and regular/medium for inputs and text. Note: currently only Google Fonts are supported.
- Rounded borders (6px-8px) for buttons and inputs, with generous internal padding and a subtle hover effect (darken by 10%).
- Alternate row highlighting or a subtle hover effect in the table to facilitate readability.
- Simple icons for actions: removing a line and copying a total.