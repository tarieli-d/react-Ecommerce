import './i18n';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { FaSearch, FaBars, FaUserAlt } from 'react-icons/fa';
import { Wave } from 'react-animated-text';
import './style.css';
import Products from './components/Products';
import Details from './components/Details';
import Contact from './components/Contact.js';
import Delivery from './components/Delivery.js';
import About from './components/About.js';
import Main from './components/Main.js';
import Menu from './components/Menu.js';
import SideNav from './components/Sidenav.js';
import Admin from './components/Admin.js';
import productsArray from './components/constants.js';
import LanguageSelector from './LanguageSelector';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const App = () => {
  const [activeMenuOption, setActiveMenuOption] = useState(-1);
  const [sidenavWidth, setSidenavWidth] = useState('0px');
  const [products, setProduct] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  //const [searchResultDisplay, setSearchResultDisplay] = useState('flex');
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const { t } = useTranslation();
  const [popupWindowShow, setPopupWindowShow] = useState('none');
  const [cartData, setCartData] = useState(new Set());
  const [quantity, setQuantity] = useState([]);
  const itemCount = [...cartData].length;
  const [cartTotal, setCartTotal] = useState(0);
  useEffect(() => {
    let temp = [];
    //copy without reference
    productsArray.forEach((item, i) => {
      temp[i] = { ...item };
    });
    setProduct(temp);
    setFilteredData(temp);
    //initialize quantity array with zeros,soon we will replace zeros with the quantity for each product user added to cart
    let arr = [];
    temp.map((e, i) => {
      arr[i] = 0;
    });
    setQuantity(arr);
  }, []);

  const Style = {
    display: popupWindowShow
  };
  /**shopping cart */
  const popupWindow = e => {
    if (e.currentTarget.className == 'close') setPopupWindowShow('none');
    else setPopupWindowShow('flex');
  };
  const addToCart = e => {
    setCartData(prev => new Set(prev).add(e));
  };
  const removeFromCart = (item, index) => {
    let q = [...quantity];
    setCartTotal(prev => {
      let t = prev - q[index] * item.price;
      q.splice(index, 1);
      q.push(0);
      return t;
    });
    setQuantity(q);
    setCartData(prev => {
      let newCart = new Set(prev);
      newCart.delete(item);
      return newCart;
    });
  };
  /**addProduct is invoked when new product is added in admin component */
  const addProduct = arg => {
    let product = {
      id: products.length,
      imgUrl: arg[0],
      title: arg[1],
      category: arg[2],
      price: arg[3],
      oldPrice: '',
      count: arg[4],
      info: arg[5],
      inCart: false,
      date: new Date().toString()
    };
    setProduct([...products, product]);
  };

  /**open left side navbar or close it*/
  const openCloseNav = e => {
    e.stopPropagation();
    if (e.currentTarget.className != 'closebtn') setSidenavWidth('100%');
    else setSidenavWidth('0px');
  };
  /**when we type something in searchBar filter products array and save to filteredData,which is displayed on screen*/
  const handleSearch = e => {
    let value = '',
      result = [];
    if (typeof e.currentTarget == 'object')
      value = e.currentTarget.value.toLowerCase();
    else {
      value = e.toLowerCase();
    }
    setSearchInput(value);
    if (value == '') {
      setSearchResult([]);
      setSearchValue('');
      return;
    }

    /*if (value == '' || typeof e.currentTarget != 'object')
      setSearchResultDisplay('none');
    else setSearchResultDisplay('flex');
    /*replace + (temporarily here and below while searching) with `,coz + breaks search,note that it is not replaced in products or filteredData array,just here for the sake of search function below*/
    value = value.replace(/\+/g, '`');
    result = [...filteredData].filter(data => {
      return data.title.replace(/\+/g, '`').search(value) != -1;
    });
    // setFilteredData(result);
    result = [...result].sort(a =>
      a.title < value ? 1 : a.title > value ? -1 : 0
    );
    if (result.length == 0) setSearchResult([{ title: t('nothing_found') }]);
    else setSearchResult(result);
  };

  return (
    <Router>
      <SideNav
        arr={[
          setSidenavWidth,
          activeMenuOption,
          setActiveMenuOption,
          sidenavWidth,
          openCloseNav
        ]}
      />
      <div className="popupWindow" style={Style}>
        <div onClick={popupWindow} className="close">
          <span>
            {t('total_price')}
            {cartTotal}
            {t('lari')}
          </span>
          <Link to="contact">{t('order')}</Link>
          <span>&times;</span>
        </div>
        {[...cartData].map((e, i) => {
          return (
            <div className="cartItem" key={i}>
              <img src={e.imgUrl} />
              <span>
                {e.title}({e.price}
                {t('lari')})
              </span>
              <span className="quantity">
                <span
                  onClick={() => {
                    let q = [...quantity];
                    if (q[i] < e.count) {
                      q[i] += 1;
                      setQuantity(q);
                      setCartTotal(prev => prev + e.price);
                    }
                  }}
                >
                  +
                </span>
                <span>{quantity[i]}</span>
                <span
                  onClick={() => {
                    let q = [...quantity];
                    if (q[i] > 0) {
                      q[i] -= 1;
                      setQuantity(q);
                      setCartTotal(prev => prev - e.price);
                    }
                  }}
                >
                  -
                </span>
              </span>
              <span
                className="del"
                onClick={() => {
                  removeFromCart(e, i);
                  let prod = [...filteredData];
                  prod.forEach(item => {
                    item.id == e.id ? (item.inCart = false) : item.inCart;
                  });
                  setFilteredData(prod);
                }}
              >
                &times;
              </span>
            </div>
          );
        })}
      </div>
      <div className={popupWindowShow == 'flex' ? 'overlay2' : 'overlay1'} />

      <div className={popupWindowShow == 'flex' ? 'overlay2' : 'overlay1'}>
        <header>
          <div className="headerTop">
            <div id="menuIcon">
              <FaBars onClick={openCloseNav} />
              <img
                style={{ width: '170px', opacity: '.8' }}
                src="https://i.ibb.co/c12pW6H/logo.jpg"
              />
            </div>

            <div id="searchBar">
              <span>
                <input
                  onChange={e => handleSearch(e)}
                  value={searchInput}
                  placeholder={t('search')}
                />
                <FaSearch
                  className="searchIcon"
                  onClick={() => {
                    setSearchValue(searchInput), setSearchResult([]);
                  }}
                />
              </span>
              <div
                //style={{ display: searchResultDisplay }}
                className="searchResult"
              >
                {searchResult.map((value, index) => {
                  while (index < 6)
                    if (
                      value.title == 'Nothing found' ||
                      value.title != 'არ მოიძებნა'
                    )
                      return (
                        <Link
                          key={index}
                          to="/products"
                          onClick={() => {
                            setSearchValue(value.title),
                              setSearchInput(value.title),
                              setSearchResult([]);
                          }}
                        >
                          {value.title}
                        </Link>
                      );
                    else
                      return (
                        <Link to="/products" key={index}>
                          {value.title}
                        </Link>
                      );
                })}
              </div>
            </div>

            <div
              onClick={popupWindow}
              style={{ margin: '.5rem', marginLeft: 'auto', cursor: 'pointer' }}
            >
              <Badge color="secondary" badgeContent={itemCount} showZero>
                <ShoppingCartIcon />{' '}
              </Badge>{' '}
            </div>
            <div id="admin">
              <Link
                to="/admin"
                onClick={() => {
                  setActiveMenuOption(-1);
                }}
              >
                <FaUserAlt />
              </Link>
            </div>

            <LanguageSelector />
          </div>
          <div className="menu">
            <Menu
              arr={[setSidenavWidth, activeMenuOption, setActiveMenuOption]}
            />
          </div>
        </header>

        <Switch>
          <Route path="/admin">
            <Admin
              addProduct={addProduct}
              arr={[
                filteredData,
                setFilteredData,
                'წაშლა',
                products,
                setProduct,
                searchValue,
                addToCart
              ]}
            />
          </Route>
          <Route path="/products">
            <Products
              arr={[
                filteredData,
                setFilteredData,
                'კალათაში',
                products,
                setProduct,
                searchValue,
                addToCart
              ]}
            />
          </Route>
          <Route
            path="/details/:id"
            /*component={Details}*/ render={props => (
              <Details arr={filteredData} {...props} />
            )}
          />
          <Route path="/delivery">
            <Delivery />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
          <Route path="/">
            <Main />
          </Route>
        </Switch>

        <footer>
          <div className="copyright">{t('copyright')}</div>
        </footer>
      </div>
    </Router>
  );
};
export default App;
