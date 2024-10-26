import React from "react"
import { Typography, Grid } from "@mui/material"
import "../home.css" // Import the CSS file
import mantralogo from "../images/mantralogo.jpg"

const HomeComponent = () => {
  return (
    <React.Fragment>
      <div className="fullWidth">
        <Typography variant="h1" className="title">
          Fractional Rental <br />
          Protocol for <br />
          Utility NFT
        </Typography>
        <div className="imageContainer">
          <img
            className="styledImage"
            src={
              "https://cdn.prod.website-files.com/6622236200773f0f3dbee8a0/6634ad7e240c298d27b94cab_for-builders.webp"
            }
            alt="Description of the image"
          />
        </div>
      </div>

      <div className="fullWidth">
        <Grid container spacing={2} style={{ width: "100%", margin: 0 }}>
          <Grid
            item
            xs={12}
            sm={4}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography className="columnText">
              <strong>Money-saving</strong>
            </Typography>
            <Typography className="columnText">
              Renting an NFT can be more cost-effective if you want to take full
              advantage of its utility, but don't want to pay the full price
              upfront. Pay smaller, periodic fees for your favorite NFT and use
              it as if it was your own.
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography className="columnText">
              <strong>Profit-sharing</strong>
            </Typography>
            <Typography className="columnText">
              By agreeing to share an NFT's utility profits with the owner after
              renting it, both parties can benefit from the NFT itself. The
              owner monetizes their NFT without the need to sell it, while you,
              the renter, capitalize on its utility at zero cost.
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingRight: "60px",
            }}
          >
            <Typography className="columnText">
              <strong>Try before you buy</strong>
            </Typography>
            <Typography className="columnText">
              Renting can help you decide if you like an NFT before committing
              to a purchase. This can be especially useful for NFTs with
              valuable utilities, as it allows you to try them out before making
              a financial investment.
            </Typography>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  )
}

export default HomeComponent
