document.addEventListener('DOMContentLoaded', function() {
    // Load initial content (dashboard)
    navigate('dashboard');
  });
  // Declare a variable to track wallet connection status
let isConnected = false;

document.getElementById('connectWalletBtn').addEventListener('click', async () => {
    try {
        if (!window.keplr) {
            alert("Please install the Keplr extension.");
            return;
        }

        const chainId = "mantra";  // Replace with the appropriate chain ID for your blockchain
        await window.keplr.enable(chainId);
        const offlineSigner = window.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();

        // Get the first account's address
        const userAddress = accounts[0].address;

        // Update the connection status and button text
        isConnected = true;
         document.getElementById('connectWalletBtn').innerText = "Wallet"; // Change button text
        // document.getElementById('username').innerText = userAddress; // Display user address
        // document.getElementById('user-info').style.display = "flex"; // Show user info section
        document.getElementById('userIcon').style.display = 'inline'; // Show user icon

    } catch (error) {
        console.error("Error connecting to Keplr:", error);
        alert("Failed to connect to Keplr Wallet.");
    }
});

document.getElementById('userIcon').addEventListener('click', async () => {
  const confirmed = confirm("Do you want to disconnect from the Keplr Wallet?");
  if (confirmed) {
      // Logic to disconnect the wallet (if supported by Keplr)
      // Unfortunately, Keplr does not provide an official disconnect method.
      // You might need to simply reset your state here.

      // Update UI to reflect disconnection
      document.getElementById('connectWalletBtn').innerText = "Connect Wallet"; // Change back button text
      document.getElementById('user-info').style.display = "none"; // Hide user info section
      document.getElementById('userIcon').style.display = 'none'; // Hide user icon
  }
});

// Update button text on page load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('connectWalletBtn').innerText = isConnected ? "Wallet" : "Connect Wallet"; // Set initial text
});


  function navigate(page) {
    const mainContent = document.getElementById('main-content');
    
    if (page === 'dashboard') {
      mainContent.innerHTML = `
        <div class="card">
          <div class="card-header">
            Dashboard
          </div>
          <div class="card-body">
            <h5 class="card-title">Welcome to RWA Launchpad</h5>
            <p class="card-text">Tokenize your real-world assets such as Real Estate, Art, and Commodities.</p>
            <a href="#" class="btn btn-primary" onclick="navigate('tokenize')">Tokenize Now</a>
          </div>
        </div>
      `;
    } else if (page === 'tokenize') {
      mainContent.innerHTML = `
        <div class="card">
          <div class="card-header">
            Tokenize Your Asset
          </div>
          <div class="card-body">
            <form>
              <div class="form-group">
                <label for="assetType">Asset Type</label>
                <select class="form-control" id="assetType">
                  <option>Real Estate</option>
                  <option>Art</option>
                  <option>Commodities</option>
                </select>
              </div>
              <div class="form-group">
                <label for="assetName">Asset Name</label>
                <input type="text" class="form-control" id="assetName" placeholder="Enter asset name">
              </div>
              <div class="form-group">
                <label for="valuation">Valuation</label>
                <input type="number" class="form-control" id="valuation" placeholder="Enter valuation">
              </div>
              <button type="submit" class="btn btn-primary">Tokenize</button>
            </form>
          </div>
        </div>
      `;
    } else if (page === 'assets') {
      mainContent.innerHTML = `
        
      <div class="container position-relative">
  

    <!-- Items Section -->
    <h2 class="mt-4 mb-3">Your Assets</h2>
   
    <div class="row flex-nowrap overflow-auto" id="assetRow">
        <!-- Card 1 -->
        
        <div class="col-md-4 mb-4 asset-card">
            <div class="card">
                <img class="card-img-top" src="https://via.placeholder.com/350x200" alt="Asset Image">
                <div class="card-body">
                    <h5 class="card-title">Asset 1</h5>
                    <p class="card-text">This is a brief description of Asset 1. It's a unique digital asset.</p>
                    <p class="card-text"><small class="text-muted">Status: Tokenized</small></p>
                    <button class="btn btn-primary">Remint</button>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-4 asset-card">
            <div class="card">
                <img class="card-img-top" src="https://via.placeholder.com/350x200" alt="Asset Image">
                <div class="card-body">
                    <h5 class="card-title">Asset 2</h5>
                    <p class="card-text">This is a brief description of Asset 1. It's a unique digital asset.</p>
                    <p class="card-text"><small class="text-muted">Status: Tokenized</small></p>
                    <button class="btn btn-primary">Remint</button>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-4 asset-card">
            <div class="card">
                <img class="card-img-top" src="https://via.placeholder.com/350x200" alt="Asset Image">
                <div class="card-body">
                    <h5 class="card-title">Asset 3</h5>
                    <p class="card-text">This is a brief description of Asset 1. It's a unique digital asset.</p>
                    <p class="card-text"><small class="text-muted">Status: Tokenized</small></p>
                    <button class="btn btn-primary">Remint</button>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-4 asset-card">
            <div class="card">
                <img class="card-img-top" src="https://via.placeholder.com/350x200" alt="Asset Image">
                <div class="card-body">
                    <h5 class="card-title">Asset 4</h5>
                    <p class="card-text">This is a brief description of Asset 1. It's a unique digital asset.</p>
                    <p class="card-text"><small class="text-muted">Status: Tokenized</small></p>
                    <button class="btn btn-primary">Remint</button>
                </div>
            </div>
        </div>
        <!-- Additional Cards here -->
    </div>

    
</div>
<div class="container my-5">
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addItemModal">
        Add Item
    </button>

    <!-- Modal -->
    <div class="modal fade" id="addItemModal" tabindex="-1" role="dialog" aria-labelledby="addItemModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addItemModalLabel">Add New Item</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addItemForm">
                        <div class="form-group">
                            <label for="itemName">Item Name</label>
                            <input type="text" class="form-control" id="itemName" placeholder="Enter item name" required>
                        </div>
                        <div class="form-group">
                            <label for="itemDescription">Description</label>
                            <textarea class="form-control" id="itemDescription" rows="3" placeholder="Enter item description" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="itemImage">Upload Image</label>
                            <input type="file" class="form-control-file" id="itemImage" accept="image/*" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="submit" form="addItemForm" class="btn btn-primary">Add Asset</button>
                </div>
            </div>
        </div>
    </div>
</div>



      `;
    }
  }
  