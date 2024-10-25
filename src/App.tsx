import React, { useEffect, useState } from "react"
import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"

declare let window: WalletWindow

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [page, setPage] = useState("dashboard")
  const [assets, setAssets] = useState<
    {
      id: string
      nftId: string
      name: string
      metadata: {
        description: string
        image: string
      }
    }[]
  >([])

  useEffect(() => {
    // Load initial content (dashboard)
    navigate("dashboard")
  }, [])

  const connectWallet = async () => {
    if (!window.keplr) {
      alert("Please install the Keplr extension.")
      return
    }

    try {
      const chainId = "mantra" // Replace with the appropriate chain ID
      await window.keplr.enable(chainId)
      const offlineSigner = window.keplr.getOfflineSigner(chainId)
      const accounts = await offlineSigner.getAccounts()

      setUserAddress(accounts[0].address)
      setIsConnected(true)
    } catch (error) {
      console.error("Error connecting to Keplr:", error)
      alert("Failed to connect to Keplr Wallet.")
    }
  }

  const disconnectWallet = () => {
    const confirmed = window.confirm(
      "Do you want to disconnect from the Keplr Wallet?"
    )
    if (confirmed) {
      setIsConnected(false)
      setUserAddress(null)
    }
  }

  const navigate = (page: any) => {
    setPage(page)
  }

  const renderContent = () => {
    switch (page) {
      case "dashboard":
        return (
          <div className="card">
            <div className="card-header">Dashboard</div>
            <div className="card-body">
              <h5 className="card-title">Welcome to RWA Launchpad</h5>
              <p className="card-text">
                Tokenize your real-world assets such as Real Estate, Art, and
                Commodities.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("tokenize")}
              >
                Tokenize Now
              </button>
            </div>
          </div>
        )

      case "tokenize":
        return (
          <div className="card">
            <div className="card-header">Tokenize Your Asset</div>
            <div className="card-body">
              <form>
                <div className="form-group">
                  <label htmlFor="assetType">Asset Type</label>
                  <select className="form-control" id="assetType">
                    <option>Real Estate</option>
                    <option>Art</option>
                    <option>Commodities</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="assetName">Asset Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="assetName"
                    placeholder="Enter asset name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="valuation">Valuation</label>
                  <input
                    type="number"
                    className="form-control"
                    id="valuation"
                    placeholder="Enter valuation"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Tokenize
                </button>
              </form>
            </div>
          </div>
        )

      case "assets":
        return (
          <div className="container">
            <h2 className="mt-4 mb-3">Your Assets</h2>
            <div className="row flex-nowrap overflow-auto">
              {Array.from({ length: 4 }, (_, index) => (
                <div className="col-md-4 mb-4" key={index}>
                  <div className="card">
                    <img
                      className="card-img-top"
                      src="https://via.placeholder.com/350x200"
                      alt={`Asset ${index + 1}`}
                    />
                    <div className="card-body">
                      <h5 className="card-title">Asset {index + 1}</h5>
                      <p className="card-text">
                        This is a brief description of Asset {index + 1}. It's a
                        unique digital asset.
                      </p>
                      <p className="card-text">
                        <small className="text-muted">Status: Tokenized</small>
                      </p>
                      <button className="btn btn-primary">Remint</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-primary mt-4"
              data-toggle="modal"
              data-target="#addItemModal"
            >
              Add Item
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="App">
      {/* Header */}
      <header className="header-container">
        <div className="d-flex align-items-center">
          <img
            src="images/assetx-logo1.png"
            alt="AssetX Logo"
            className="img-fluid logo-img"
          />
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
                  href="#dashboard"
                  onClick={() => navigate("dashboard")}
                >
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#tokenize"
                  onClick={() => navigate("tokenize")}
                >
                  Tokenize Asset
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
                  <img
                    src="user-icon-placeholder.png"
                    alt="User Icon"
                    style={{ display: "inline" }}
                  />
                </span>
              )}
              <li
                className="nav-item"
                id="userIcon"
                style={{ display: "none" }}
              >
                <span className="user-icon">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </li>
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

      {/* Main Content */}
      <div className="content">
        <section className="hero-section container mt-5">
          <div className="col-md-6">
            <h1 className="tagline">Empowering Your Assets for the Future</h1>
          </div>
          <div className="col-md-6 text-right">
            {/* Placeholder for an image */}
          </div>
        </section>

        <main id="main-content" className="body container mt-4">
          {renderContent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <span>© 2024 AssetX. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  )
}

export default App
