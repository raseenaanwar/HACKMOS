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
      category: "Financial Assets",
      id: "3",
      name: "Apple Stock",
      description: "Shares of Apple Inc.",
      image:"data:image/jpeg;base64,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",
      type: "token",
      tokenBalance: 10,
      expiry:60 , // No expiration for stocks
      
    },
    {
      category: "Intellectual Property",
      id: "3",
      name: "Innovative Software Patent",
      description: "A patent for an AI-based software optimizing energy usage in smart homes.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcInmh4BHgK2neD0hvi1C72Tv7lM2IkCji8w&s",
      type: "token",
      tokenBalance: 15,
      expiry: 365 // Expiry in days
    },

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
                height: "500px",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(128, 0, 128, 0.7), 0 0 20px rgba(255, 0, 255, 0.5)";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 16px rgba(128, 0, 128, 0.5)";
                e.currentTarget.style.transform = "scale(1)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(0, 128, 255, 0.8), 0 0 15px rgba(0, 255, 255, 0.7)";
                e.currentTarget.style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(128, 0, 128, 0.7), 0 0 20px rgba(255, 0, 255, 0.5)";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover", objectPosition: "top" }}
              />
              <div className="card-body" style={{ flex: "1" }}>
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
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px",
                  marginTop: "auto", // Ensures button is at bottom
                }}
              >
                {item.type === "token" ? (
  <Button
    variant="contained"
    onClick={RemintNFT}
    style={{
      width: "90%",
      background: "linear-gradient(45deg, #FF69B4, #8A2BE2)", // Pink to Purple gradient
      color: "#fff",
    }}
  >
    Remint
  </Button>
) : (
  <Button
    variant="contained"
    onClick={TokenizeNFT}
    style={{
      width: "90%",
      background: "linear-gradient(45deg, #FF69B4, #8A2BE2)", // Pink to Purple gradient
      color: "#fff",
    }}
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
  );

        
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
