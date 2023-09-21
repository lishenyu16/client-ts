import React, { useState } from 'react'
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { signInThunk } from '../../redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks';
import { boxSx } from './SignUp';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { throttle } from '../../utils/utility';

export default () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    setError(false);
    dispatch(signInThunk({ email, password }))
      .then((res) => {
        if (res.payload && res.payload.success) {
          navigate('/');
        } else if (res.payload && res.payload.statusCode === 401) {
          setError(true);
        }
      });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={boxSx}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error &&
            <div style={{ color: 'red', fontSize: '15px' }}>
              <p>Sorry, something you entered does not match our records.</p>
              <p>
                Please try again.
              </p>
            </div>
          }
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={throttle(handleSubmit, 3500)}
            disabled={!email || !password}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <RouterLink to="/forgotpassword" style={{ color: 'darkblue' }}>
                Forgot password?
              </RouterLink>
            </Grid>
            <Grid item>
              <RouterLink to='/signup' style={{ color: 'darkblue' }}>
                {"Don't have an account? Sign Up"}
              </RouterLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}


