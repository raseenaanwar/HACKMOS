
import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AddItemForm from "./AddItemForm.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
 import logo from "./images/assetxlogo.png";
declare let window: WalletWindow;

interface Item {
  id: string;
  nftId: string;
  name: string;
  metadata: {
    description: string;
    image: string;
  };
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [page, setPage] = useState<"home" | "tokenize" | "addItem" | "assets">("home");
  const [items, setItems] = useState<Item[]>([]); // State to hold the items

  const onAddItem = (newItem: Item) => {
    setItems((prevItems) => [...prevItems, newItem]); // Add the new item to the list
  };

  useEffect(() => {
    navigate("home");
  }, []);

  const connectWallet = async () => {
    if (!window.keplr) {
      alert("Please install the Keplr extension.");
      return;
    }

    try {
      const chainId = "mantra";
      await window.keplr.enable(chainId);
      const offlineSigner = window.keplr.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();

      setUserAddress(accounts[0].address);
      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting to Keplr:", error);
      alert("Failed to connect to Keplr Wallet.");
    }
  };

  const disconnectWallet = () => {
    const confirmed = window.confirm("Do you want to disconnect from the Keplr Wallet?");
    if (confirmed) {
      setIsConnected(false);
      setUserAddress(null);
    }
  };

  const navigate = (page: "home" | "tokenize" | "addItem" | "assets") => {
    setPage(page);
  };

  const renderContent = () => {
    switch (page) {
      case "home":
        return (
          <div className="card">
            <div className="card-header">Home</div>
            <div className="card-body">
              <h5 className="card-title">Welcome to RWA Launchpad</h5>
              <p className="card-text">
                Tokenize your real-world assets such as Real Estate, Art, and
                Commodities.
              </p>
              <button className="btn btn-primary" onClick={() => navigate("tokenize")}>
                Tokenize Now
              </button>
            </div>
          </div>
        );

      case "tokenize":
        return (
          <div className="card">
            <div className="card-header">Tokenize Your Asset</div>
            <div className="card-body">
              {/* Your existing Tokenize form goes here */}
              <form>
                {/* Tokenize form fields */}
              </form>
            </div>
          </div>
        );

      case "addItem":
        return (
          <div className="card">
            <div className="card-header">Add New Item</div>
            <div className="card-body">
              <AddItemForm onAddItem={onAddItem} /> {/* Pass the onAddItem function */}
            </div>
          </div>
        );

      case "assets":
        return (
          <div style={{ width: "100vw", padding: "0" }}>
            <h2 className="mt-4 mb-3">Your Assets</h2>
            <div className="row flex-nowrap overflow-auto">
              {Array.from({ length: 4 }, (_, index) => (
                <div className="col-lg-3 col-md-4 mb-4" key={index} style={{ marginRight: "1px" }}>
                  
                  <div
                    className="card"
                    style={{
                      transition: "box-shadow 0.3s ease, transform 0.3s ease",
                      boxShadow: "0 8px 16px rgba(128, 0, 128, 0.5)", // Default shadow
                      borderRadius: "15px", // Rounded corners
                      overflow: "hidden", // Ensure rounded corners are applied to the content
                      cursor: "pointer",
                      width: "300px", // Increased width
                      height: "400px", // Increased height
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 12px 24px rgba(128, 0, 128, 0.7), 0 0 20px rgba(255, 0, 255, 0.5)"; // Shadow on hover
                      e.currentTarget.style.transform = "scale(1.02)"; // Slight scale on hover
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 8px 16px rgba(128, 0, 128, 0.5)"; // Reset shadow
                      e.currentTarget.style.transform = "scale(1)"; // Reset scale
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(0, 128, 255, 0.8), 0 0 15px rgba(0, 255, 255, 0.7)"; // Shadow when clicked
                      e.currentTarget.style.transform = "scale(0.98)"; // Scale down on click
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 12px 24px rgba(128, 0, 128, 0.7), 0 0 20px rgba(255, 0, 255, 0.5)"; // Shadow on hover after click
                      e.currentTarget.style.transform = "scale(1.02)"; // Scale up back
                    }}
                  >
                    <img
                      className="card-img-top"
                      src="https://via.placeholder.com/350x200"
                      alt={`Asset ${index + 1}`}
                      style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }} // Rounded corners for the image
                    />
                    <div className="card-body">
                      <h5 className="card-title">Asset {index + 1}</h5>
                      <p className="card-text">
                        This is a brief description of Asset {index + 1}. It's a unique digital asset.
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
            <button type="button" className="btn btn-primary mt-4" onClick={() => navigate("addItem")}>
              Add Item
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="header-container">
        <div className="d-flex align-items-center">
          <img
            src={logo}
            alt="AssetX Logo"
            style={{
              width: '83px', // Adjust width for smaller size
              height: '83px', // Keep height the same to maintain the circular shape
              borderRadius: '50%', // Makes the image round
              objectFit: 'cover', // Ensures the image covers the entire area without distortion
            }}
            onError={(e) => e.currentTarget.alt = "Image not found"}
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
                  href="#home"
                  onClick={() => navigate("home")}
                >
                  Home
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
                  <FontAwesomeIcon icon={faUser} style={{ color: "white" }} />
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
            <h1 className="tagline">Empowering Real-World Assets</h1>
            {renderContent()} {/* Render the content based on the selected page */}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
