"use client"
import { Fragment, useState, useEffect } from 'react'; 
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Container, Button, TextField} from '@mui/material';

function createData(id, name, itemCost, gCost) {
  return {id, name, itemCost, gCost};
}

const productColumnHeader = ["Product", "Cost per item", "Qty"]
const cartColumnHeader = ["Product", "Cost per item", "Qty", "Total Cost"]

export default function Home() {
  const [cart, setCart] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [products, setProducts] = useState({})
  const [cartEmpty, setCartEmpty] = useState(true)

  useEffect(() => {
    let result = 0;
    Object.keys(cart).map((key) => (result += (cart[key].itemCost * cart[key].qty)));
    setTotalCost(result);
    if (result > 0) {
      setCartEmpty(false)
    } else {
      setCartEmpty(true)
    }
  }, [cart])

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
      })
  }, [])

  function ProductTable() {
    return(
      <div>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow key={"product_header"}>
                {productColumnHeader.map((column) => (
                  <TableCell>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(products).map((key) => (
                <TableRow key={products[key].id}>
                <TableCell>{products[key].name}</TableCell>
                <TableCell>{products[key].itemCost}</TableCell>
                <TableCell><TextField id={String(products[key].id)+String(products[key].name)} label="Qty" variant="standard" defaultValue={1}/></TableCell>
                <TableCell>
                  <Button onClick={() => handleCartItemAdd(products[key].id, products[key].name, products[key].itemCost, products[key].gCost, parseInt(document.getElementById(String(products[key].id)+String(products[key].name)).value))}>Add to cart</Button>
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }  

  function CartTable() {
    return(
      <div>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow key={"product_header"}>
                {cartColumnHeader.map((column) => (
                  <TableCell>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
            {Object.keys(cart).map((key) => (
              <TableRow key={key}>
                <TableCell>{cart[key].name}</TableCell>
                <TableCell>{cart[key].itemCost}</TableCell>
                <TableCell>{cart[key].qty}</TableCell>
                <TableCell>{(cart[key].qty * cart[key].itemCost).toFixed(2)}</TableCell>
                <TableCell>
                  <Button onClick={() => {handleCartItemRemove(key)}}>Remove from cart</Button>
                </TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }  

  function handleCartItemAdd(productId, name, itemCost, gCost, qty) {
    if (productId in cart) {
      setCart((prev) => (
        {...prev, 
        [productId]: {
          ...createData(productId, name, itemCost, gCost),
          "qty": prev[productId]["qty"] + qty,
        }}
        ))
    } else {
      setCart((prev) => (
        {...prev, 
        [productId]: {
          ...createData(productId, name, itemCost, gCost),
          "qty": qty,
        }}
      ))
    }
  }

  function handleCartItemRemove(key) {
    let temp=cart;
    delete temp[key]; 
    setCart({...temp})
  }

  function handleOrderComplete() {
    // Send data to the backend via POST
    fetch('/api/orders/add', {  
      method: 'POST', 
      body: JSON.stringify(totalCost) 
    }).then((res) => res.json())
    .then((data) => fetch('/api/order_items/add', {  
      method: 'POST', 
      body: JSON.stringify({data, cart}) 
    }))
  }

  return (
    <Fragment>
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" >
          <h2>Products</h2>
          <ProductTable />
        </Box>
        <Box display="flex" flexDirection="column" >
          <h2>Cart</h2>
          <CartTable />
          Amount Payable: {totalCost.toFixed(2)}
          {!cartEmpty ? <Button onClick={handleOrderComplete}>Purchase Order</Button>: ""}
        </Box>
      </Container>
    </Fragment>
  );
}
