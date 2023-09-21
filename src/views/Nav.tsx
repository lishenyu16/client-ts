import React, { useEffect } from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

import { NavLink, Link } from 'react-router-dom';
import { isMobileOrPc } from '../utils/utils';
import { Box, AppBar, Drawer, IconButton, Toolbar, Button, MenuItem, Menu } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/reduxHooks';
import { logout } from '../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
// import { setCurrentArticle } from '../redux/reducers/articleSlice';

const linkActive = ({ isActive }: { isActive: boolean }) => {
  return {
    fontWeight: 'bold',
    color: isActive ? 'blue' : isMobileOrPc() ? 'deepskyblue' : 'inherit',
    textDecoration: 'none',
    margin: '5px',
    display: 'flex',
    alignItems: 'center',
    width: '100px'
  }
}

export default () => {
  const { userInfo } = useAppSelector(state => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const drawerWidth = 180;

  const navItems = [
    <NavLink to='/' style={linkActive}><HomeOutlinedIcon style={{ marginRight: '5px' }} /> Home</NavLink>,
    <NavLink to='/articles' style={linkActive}><ArticleOutlinedIcon style={{ marginRight: '5px' }} /> Articles</NavLink>,
    <NavLink to='/timeline' style={linkActive}><TimelineOutlinedIcon style={{ marginRight: '5px' }} /> Timeline</NavLink>,
    <NavLink to='/about' style={linkActive}><BadgeOutlinedIcon style={{ marginRight: '5px' }} /> About</NavLink>,
  ]
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const [userMenu, setUserMenu] = React.useState<HTMLElement | null>(null);
  const open = Boolean(userMenu);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOnUserMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setUserMenu(e.currentTarget);
  }
  const handleCloseUserMenu = () => {
    setUserMenu(null);
  };

  const isArticlePage = () => {
    return location.pathname.startsWith('/article/') || location.pathname.startsWith('/articles');
  }
  const handleClickWrite = () => {
    if (userInfo) {
      // dispatch(setCurrentArticle(null));
      navigate('create-article');
    } else {
      navigate('/signUp');
    }
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      {navItems.map((item, i) => (
        <React.Fragment key={i}>{item}</React.Fragment>
      ))}
    </Box>
  );
  const WriteButton = (
    <Button variant="text" sx={{ textTransform: 'none' }} onClick={handleClickWrite}>
      <CreateOutlinedIcon /> Write
    </Button>
  );

  if (isMobileOrPc()) { //if device is mobile
    return (
      <Box sx={{ display: 'flex' }}>
        <AppBar
          component="nav"
          position='static'
          sx={{
            backgroundColor: 'transparent',
            height: '5%',
          }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            {isArticlePage() && WriteButton}
            {userInfo ? (
              <div>
                <IconButton
                  size="large"
                  onClick={(e) => handleMenu(e)}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                </Menu>
              </div>
            ) :
              <Button color="inherit" sx={{ textTransform: 'none' }}>
                <Link to='/signIn'>Login</Link>
              </Button>}
          </Toolbar>
        </AppBar>
        <Box component="nav">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
      </Box>
    )
  }

  return (
    <Box className='nav'>
      {navItems.map((item, index) => (
        <React.Fragment key={index}>{item}</React.Fragment>
      ))}
      <div style={{ position: 'absolute', right: '30px', top: '15px' }}>
        {userInfo ?
          <React.Fragment>
            {isArticlePage() && WriteButton}
            <Button
              sx={{ textTransform: 'none', backgroundColor: 'lightgray', borderRadius: '17px' }}
              onClick={(e) => handleClickOnUserMenu(e)}
            >
              {userInfo.username}
            </Button>
            <Menu
              anchorEl={userMenu}
              id="account-menu"
              open={open}
              onClose={handleCloseUserMenu}
              onClick={handleCloseUserMenu}
            // transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            // anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                <Avatar sx={{ width: '20px', height: '20px', marginRight: '5px' }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Avatar sx={{ width: '20px', height: '20px', marginRight: '5px' }} /> My account
              </MenuItem>
              <Divider />

              <MenuItem onClick={handleCloseUserMenu}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={() => dispatch(logout())}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </React.Fragment> :

          <React.Fragment>
            {isArticlePage() && WriteButton}
            <Button color="inherit" sx={{ textTransform: 'none' }}>
              <Link to='/signIn'>Login</Link>
            </Button>
          </React.Fragment>
        }
      </div>
    </Box>
  );
}