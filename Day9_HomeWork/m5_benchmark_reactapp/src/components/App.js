import React, { Component } from 'react';
import '../App.css';
import {
  Container,
  Row,
  Col,
  NavDropdown,
  Navbar,
  Nav,
  Card
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
const apiKey = process.env.REACT_APP_API_URL

class App extends Component {

  state = {
    products: []
  }

  fetchProducts = async () => {
    const resp = await fetch(apiKey + "/products/")

    if (resp.ok) {
      const products = await resp.json()
      this.setState({
        products
      });
    }
  }

  fetchCategory = async (category) => {
    this.setState({
      products: []
    });
    const resp = await fetch(apiKey + "/products?category=" + category)

    if (resp.ok) {
      const products = await resp.json()
      this.setState({
        products
      });
    }
  }

  componentDidMount() {
    this.fetchProducts()
  }
  changePage = (id) => {
    this.props.history.push("/productDetails/" + id)
  }

  render() {
    return (
      <div className="App">
        <Navbar bg="light" expand="lg">
          <Navbar.Brand onClick={() => this.props.history.push("/")}>Oiii SHOP</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link onClick={() => this.fetchProducts()}> Home</Nav.Link>
              <NavDropdown title="Categories" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => this.fetchCategory("smartphones")}>Smarphones</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.fetchCategory("watches")}>Watches</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.fetchCategory("bikes")}>Bikes</NavDropdown.Item>
              </NavDropdown>
              <Link className="nav-link" to={"/backoffice"}>BackOffice</Link>
              <NavDropdown title="Options" id="basic-nav-dropdown">
                <NavDropdown.Item href={apiKey + "/products/convert/exportToCSV"}>Products(CSV)</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Container className="mt-4">
          <Row md={4}>
            {this.state.products.map(product =>
              <Col key={product.id}>
                <Card style={{ width: '15rem' }} className="mb-2">
                  <Card.Img onClick={() => this.changePage(product.id)} variant="top" src={product.imageUrl} height="250px" />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <label>Brand: {product.brand}</label>
                    <label>Category: {product.category}</label>
                    <Card.Text>{product.description}</Card.Text>
                    <label>Price: {product.price} $</label><br></br>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </Container>
      </div >
    );
  }
}

export default App;
