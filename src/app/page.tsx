"use client"

import React, { useEffect, useState } from "react"
import { SigningStargateClient, coins } from "@cosmjs/stargate"
import { defaultRegistryTypes } from "@cosmjs/stargate"
import { Registry } from "@cosmjs/proto-signing"
import CreateEventForm from "./components/CreateEventForm"
import QueryEvent from "./components/QueryEvent"
import { Button } from "@mui/material"
import { ToastContainer, toast } from "react-toastify"
import { cosmos, fractionnft } from "fractionnft-js"
import "react-toastify/dist/ReactToastify.css"
import HomeComponent from "./components/HomeComponent"
import AddItemForm from "./components/AddItemForm"
import logo from "./images/assetxlogo.png"
import "bootstrap/dist/css/bootstrap.min.css"

declare let window: WalletWindow

interface Item {
  category: string
  id: string
  name: string
  description: string
  image: string
  type: string
  tokenBalance?: number
  expiry?: number
}

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [client, setClient] = useState<any>()
  const [page, setPage] = useState<"home" | "tokenize" | "addItem" | "assets">(
    "home"
  )

  const [items, setItems] = useState<Item[]>( [
    {
      category: "Real Estate",
      id: "1",
      name: "Oceanview Apartment",
      description: "A beautiful oceanfront apartment with a breathtaking view.",
      image: "https://upload.wikimedia.org/wikipedia/en/thumb/9/93/Burj_Khalifa.jpg/1200px-Burj_Khalifa.jpg",
      type: "token",
      tokenBalance: 10,
      expiry: 30 // Expiry in days
    },
    {
      category: "Artwork",
      id: "2",
      name: "Modern Sculpture",
      description: "An abstract sculpture representing unity and balance.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/640px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
      type: "nft",
      // Optional fields left out to demonstrate flexibility
    }
  ]) // State to hold the items

  const onAddItem = (newItem: Item) => {
    setItems((prevItems) => [...prevItems, newItem]) // Add the new item to the list
  }

  // Replace with your local node's chain ID and RPC endpoint
  const chainId = "mantra-localchain-2" // Replace with your local chain ID
  const rpcEndpoint = "http://localhost:26657" // Local node's RPC endpoint

  const connectWallet = async () => {
    try {
      // Enable Keplr for the local chain
      await window.keplr.experimentalSuggestChain({
        chainId,
        chainName: "MANTRA",
        rpc: rpcEndpoint,
        rest: "http://localhost:1317", // Replace with your REST endpoint if available
        bip44: {
          coinType: 118,
        },
        bech32Config: {
          bech32PrefixAccAddr: "mantra",
          bech32PrefixAccPub: "mantrapub",
          bech32PrefixValAddr: "mantravaloper",
          bech32PrefixValPub: "mantravaloperpub",
          bech32PrefixConsAddr: "mantravalcons",
          bech32PrefixConsPub: "mantravalconspub",
        },
        currencies: [
          {
            coinDenom: "OM",
            coinMinimalDenom: "uom",
            coinDecimals: 6,
          },
        ],
        feeCurrencies: [
          {
            coinDenom: "OM",
            coinMinimalDenom: "uom",
            coinDecimals: 6,
          },
        ],
        stakeCurrency: {
          coinDenom: "OM",
          coinMinimalDenom: "uom",
          coinDecimals: 6,
        },
      })

      await window.keplr.enable(chainId)
      const offlineSigner = window.keplr.getOfflineSigner(chainId)
      const accounts = await offlineSigner.getAccounts()
      setAddress(accounts[0].address)
      const client = await SigningStargateClient.connectWithSigner(
        rpcEndpoint,
        window.keplr.getOfflineSigner(chainId),
        {
          registry: new Registry([
            ...defaultRegistryTypes,
            ...fractionnft.v1.registry,
          ]),
        }
      )
      setClient(client)
      setIsConnected(true)
      toast("Connected!")
    } catch (err) {
      //   toast("Failed to connect!")
      console.error(err)
    }
  }

  useEffect(() => {
    navigate("home")
  }, [])

  useEffect(() => {
    if (isConnected) {
      fetchNFTs()
      fetchTokens()
    }
  }, [isConnected])

  const fetchNFTs = async () => {
    try {
      const qclient = await cosmos.ClientFactory.createRPCQueryClient({
        rpcEndpoint: "http://localhost:26657",
      })

      const result = await qclient.cosmos.nft.v1beta1.nFTs({
        owner: address!,
        classId: "Real_Estate",
      })

      const nftItems = result.nfts.map((nft) => {
        const rawString = new TextDecoder().decode(nft.data?.value!)

        const fields = rawString.split(/\f/)

        const name = fields[1]?.trim()
        const combined = fields[2]?.trim()

        const cleanedCombined = combined
          ? combined.replace(/[\x12\f]+/g, "")
          : null

        const [description, image] = cleanedCombined
          ? cleanedCombined.split(/\x1A\?/).map((field) => field.trim())
          : [null, null]

        return {
          name,
          id: nft.id,
          category: nft.classId,
          image: image || "",
          description: description || "",
          type: "nft",
        }
      })

      setItems((prevItems) => [...prevItems, ...nftItems])

      // assertIsBroadcastTxSuccess(result);
    } catch (err) {
      console.error(err)
    }
  }

  const fetchNFT = async (category: string, id: string) => {
    const qclient = await cosmos.ClientFactory.createRPCQueryClient({
      rpcEndpoint: "http://localhost:26657",
    })

    const { nft } = await qclient.cosmos.nft.v1beta1.nFT({
      id,
      classId: category,
    })

    if (nft) {
      const rawString = new TextDecoder().decode(nft.data?.value)

      const fields = rawString.split(/\f/)

      const name = fields[1]?.trim()
      const combined = fields[2]?.trim()

      const cleanedCombined = combined
        ? combined.replace(/[\x12\f]+/g, "")
        : null

      const [description, image] = cleanedCombined
        ? cleanedCombined.split(/\x1A\?/).map((field) => field.trim())
        : [null, null]

      return {
        name,
        id: nft.id,
        category: nft.classId,
        image: image || "",
        description: description || "",
        type: "token",
      }
    }
  }

  const fetchTokens = async () => {
    const qclient = await cosmos.ClientFactory.createLCDClient({
      restEndpoint: "http://localhost:1317",
    })

    const { balances } = await qclient.cosmos.bank.v1beta1.allBalances({
      address: address!,
    })

    const tokens = balances.filter((token) => token.denom != "uom")

    const tokenItems: Item[] = []
    for (const token of tokens) {
      const [_, category, id] = token.denom.split("-")
      const res = await fetchNFT(category, id)
      if (res) {
        tokenItems.push(res)
      }
    }
    setItems((prevItems) => [...prevItems, ...tokenItems])
  }

  const AddAsset = async () => {}

  const TokenizeNFT = async () => {}

  const RemintNFT = async () => {}

  const TransferToken = async () => {}

  const TransferNFT = async () => {}

  const disconnectWallet = () => {
    const confirmed = window.confirm(
      "Do you want to disconnect from the Keplr Wallet?"
    )
    if (confirmed) {
      setIsConnected(false)
      setAddress(null)
    }
  }

  const navigate = (page: "home" | "tokenize" | "addItem" | "assets") => {
    setPage(page)
  }

  const renderContent = () => {
    switch (page) {
      case "home":
        return <HomeComponent />
      // return (
      //   <div className="card">
      //     <div className="card-header">Home</div>
      //     <div className="card-body">
      //       <h5 className="card-title">Welcome to RWA Launchpad</h5>
      //       <p className="card-text">
      //         Tokenize your real-world assets such as Real Estate, Art, and
      //         Commodities.
      //       </p>
      //       <button className="btn btn-primary" onClick={() => navigate("tokenize")}>
      //         Tokenize Now
      //       </button>
      //     </div>
      //   </div>
      // );

      case "tokenize":
        return (
          <div className="card">
            <div className="card-header">Tokenize Your Asset</div>
            <div className="card-body">
              {/* Your existing Tokenize form goes here */}
              <form>{/* Tokenize form fields */}</form>
            </div>
          </div>
        )

      case "addItem":
        return (
          <div className="card">
            <div className="card-header">Add New Item</div>
            <div className="card-body">
              <AddItemForm onAddItem={onAddItem} />{" "}
              {/* Pass the onAddItem function */}
            </div>
          </div>
        )

        case "assets":
          return (
            <div style={{ width: "100vw", padding: "0", height: "100vh" }}>
              <h2 className="mt-4 mb-3">Your Assets</h2>
              <div className="row flex-nowrap overflow-auto">
                {items.map((item, index) => (
                  <div
                    className="col-lg-3 col-md-4 mb-4"
                    key={item.id || index}
                    style={{ marginRight: "1px" }}
                  >
                    <div
                      className="card"
                      style={{
                        transition: "box-shadow 0.3s ease, transform 0.3s ease",
                        boxShadow: "0 8px 16px rgba(128, 0, 128, 0.5)",
                        borderRadius: "15px",
                        overflow: "hidden",
                        cursor: "pointer",
                        width: "300px",
                        height: "450px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 12px 24px rgba(128, 0, 128, 0.7), 0 0 20px rgba(255, 0, 255, 0.5)"
                        e.currentTarget.style.transform = "scale(1.02)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 8px 16px rgba(128, 0, 128, 0.5)"
                        e.currentTarget.style.transform = "scale(1)"
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 4px 8px rgba(0, 128, 255, 0.8), 0 0 15px rgba(0, 255, 255, 0.7)"
                        e.currentTarget.style.transform = "scale(0.98)"
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 12px 24px rgba(128, 0, 128, 0.7), 0 0 20px rgba(255, 0, 255, 0.5)"
                        e.currentTarget.style.transform = "scale(1.02)"
                      }}
                    >
                      <img src={item.image} alt={item.name} className="card-img-top" style={{ height: "200px", objectFit: "cover" }} />
                      <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text">{item.description}</p>
                        {item.tokenBalance !== undefined && (
                          <p className="card-text">
                            <strong>Token Balance:</strong> {item.tokenBalance}
                          </p>
                        )}
                        {item.expiry !== undefined && (
                          <p className="card-text">
                            <strong>Expiry:</strong> {item.expiry} days
                          </p>
                        )}
                        {item.type === "token" ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={RemintNFT}
                          >
                            Remint
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={TokenizeNFT}
                          >
                            Tokenize
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        
      default:
        return null
    }
  }

  return (
    <div className="App">
      <header className="header-container">
        <div className="d-flex align-items-center">
          <img
            src={logo.src}
            alt="AssetX Logo"
            style={{
              width: "83px", // Adjust width for smaller size
              height: "83px", // Keep height the same to maintain the circular shape
              borderRadius: "50%", // Makes the image round
              objectFit: "cover", // Ensures the image covers the entire area without distortion
            }}
            onError={(e) => (e.currentTarget.alt = "Image not found")}
          />
          {/* Website Name */}
          <h1
            style={{
              fontSize: "1.5em", // Font size of the name
              marginLeft: "15px", // Space between logo and website name
              background: "linear-gradient(90deg, #9b59b6, #e91e63)", // Gradient color
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)", // Shadow for text
              // letterSpacing: '0.1em', // Spacing between letters
              fontWeight: "bold", // Make the font bold
            }}
          >
            FractionXChange
          </h1>
        </div>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#home"
                  onClick={() => navigate("home")}
                >
                  Home
                </a>
              </li>
              
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#assets"
                  onClick={() => navigate("assets")}
                >
                  My Assets
                </a>
              </li>
              <button
                onClick={connectWallet}
                className="btn btn-primary"
                id="connectWalletBtn"
              >
                {isConnected ? "Wallet" : "Connect Wallet"}
              </button>
              {isConnected && (
                <span
                  onClick={disconnectWallet}
                  className="user-icon"
                  style={{ cursor: "pointer" }}
                >
                  {/* <FontAwesomeIcon icon={faUser} style={{ color: "white" }} /> */}
                </span>
              )}
            </ul>
          </div>
        </nav>
        <div id="user-info" style={{ display: "none", alignItems: "center" }}>
          <img src="https://via.placeholder.com/40" alt="User" />
          <span id="username" style={{ color: "white" }}>
            Username
          </span>
        </div>
      </header>

      <div className="content">
        <section className="hero-section container mt-5">
          <div className="col-md-6">
            {/* <h1 className="tagline">Empowering Real-World Assets</h1> */}
            {renderContent()}{" "}
            {/* Render the content based on the selected page */}
          </div>
        </section>
      </div>
    </div>
  )

  //   return (
  //     <div style={{ padding: "20px" }}>
  //       <ToastContainer />
  //       <div
  //         style={{
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: "center",
  //           marginBottom: 40,
  //         }}
  //       >
  //         {/* <img src={logo} className='App-logo' alt='logo' /> */}
  //         <div
  //           style={{
  //             fontSize: "27px",
  //             fontWeight: "bold",
  //           }}
  //         >
  //           Event Management DApp
  //         </div>
  //       </div>
  //       <div
  //         style={{
  //           display: "flex",
  //           flexDirection: "column",
  //           justifyContent: "space-evenly",
  //           height: "22rem",
  //         }}
  //       >
  //         {address ? (
  //           <p>Connected Wallet Address: {address}</p>
  //         ) : (
  //           <Button
  //             variant="contained"
  //             color="secondary"
  //             onClick={connectWallet}
  //             style={{ width: "18rem" }}
  //           >
  //             Connect Keplr Wallet
  //           </Button>
  //         )}

  //         {client && address && (
  //           <CreateEventForm address={address} client={client} />
  //         )}

  //         <QueryEvent address={address} client={client} />
  //       </div>
  //     </div>
  //   )
}

export default App
