
import React from 'react';
import { Typography, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import mantralogo from '../images/mantralogo.jpg'; // Make sure the path to the image is correct

// Styles using Material-UI makeStyles
const useStyles = makeStyles({
  // Animation keyframes
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(-20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes rotate': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
  fullWidthContainer: {
    width: '100vw',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0 10px',
  },
  title: {
    fontSize: '4em',
    background: 'linear-gradient(90deg, #9b59b6, #e91e63, #f1c40f)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    animation: '$fadeIn 2s ease-in-out',
    margin: '40px 0 20px 0',
    textAlign: 'left',
    textShadow: '5px 5px 10px rgba(0, 0, 0, 0.6)',
    letterSpacing: '0.1em',
  },
  columnText: {
    fontSize: '1.2em',
    color: '#ffffff',
    textAlign: 'center',
    margin: '60px 0 0 0',
  },
  styledImageContainer: {
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '60px',
  },
  styledImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    animation: '$rotate 20s linear infinite',
  },
});

const HomeComponent = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.fullWidthContainer}>
        <Typography variant="h1" className={classes.title}>
          Fractional Rental <br />
          Protocol for <br />
          Utility NFT
        </Typography>
        <div className={classes.styledImageContainer}>
          <img src={mantralogo} alt="Description of the image" className={classes.styledImage} />
        </div>
      </div>
      
      <div className={classes.fullWidthContainer}>
        <Grid container spacing={2} style={{ width: '100%', margin: 0 }}>
          <Grid item xs={12} sm={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography className={classes.columnText}>
              <strong>Money-saving</strong>
            </Typography>
            <Typography className={classes.columnText}>
              Renting an NFT can be more cost-effective if you want to take full advantage of its utility, but don't want to pay the full price upfront. Pay smaller, periodic fees for your favorite NFT and use it as if it was your own.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography className={classes.columnText}>
              <strong>Profit-sharing</strong>
            </Typography>
            <Typography className={classes.columnText}>
              By agreeing to share an NFT's utility profits with the owner after renting it, both parties can benefit from the NFT itself. The owner monetizes their NFT without the need to sell it, while you, the renter, capitalize on its utility at zero cost.
    
    
    
    
    
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingRight: '60px' }}>
            <Typography className={classes.columnText}>
              <strong>Try before you buy</strong>
            </Typography>
            <Typography className={classes.columnText}>
              Renting can help you decide if you like an NFT before committing to a purchase. This can be especially useful for NFTs with valuable utilities, as it allows you to try them out before making a financial investment.
            </Typography>
          </Grid>
        </Grid>
      </div>
    </>

  );
};

export default HomeComponent;
