import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

export async function reject(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).reject();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [beneficiary, setBeneficiary] = useState();
  const [arbiter, setArbiter] = useState();
  const [amount, setAmount] = useState();
  const [value, setValue] = useState();

  function handleBeneficiaryChange(event) {
    setBeneficiary(event.target.value);
  }

  function handleArbiterChange(event) {
    setBeneficiary(event.target.value);
  }

  function handleAmountChange(event) {
    setAmount(event.target.value);
    setValue(ethers.utils.parseEther(event.target.value));
  }

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
      console.log("account[0] ", accounts[0]);
      console.log("signer ", signer);
      setBeneficiary("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");
      setArbiter("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
      setAmount(1);
      setValue(ethers.utils.parseEther("1"));
      console.log("value ", ethers.utils.parseEther("1"));
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);
    
    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          const elements = document.querySelectorAll("[data-address='"+ escrowContract.address + "']");
          for (const element of elements) {
              element.className = 'complete';
              element.innerText = "✓ It's been rejected!";
          }
        });

        await approve(escrowContract, signer);
      },
      handleReject: async () => {
        escrowContract.on('Rejected', () => {
            const elements = document.querySelectorAll("[data-address='"+ escrowContract.address + "']");
            for (const element of elements) {
              element.className = 'complete';
              element.innerText = "✓ It's been rejected!";
            }
        });

        await reject(escrowContract, signer);
      }
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" value={arbiter} onChange={handleBeneficiaryChange}/>
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" value={beneficiary} onChange={handleArbiterChange}/>
        </label>

        <label>
          Deposit Amount (in ETH)
          <input type="text" id="wei" value={amount} onChange={handleAmountChange}/>
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
