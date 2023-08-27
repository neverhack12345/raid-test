import CssBaseline from '@mui/material/CssBaseline';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <CssBaseline />
      <h1 style={{textAlign:"center"}}>RAiD POS (Point of Sales) System</h1>
        {children}
      </body>
    </html>
  )
}