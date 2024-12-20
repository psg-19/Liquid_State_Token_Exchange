import React, { useEffect, useState } from 'react'
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';

// import { Token } from '@solana/spl-token';


export const Solana = () => {
    
    
    const {connection}=useConnection()
    const wallet=useWallet()
    const [sol, setSol] = useState("");  
    const [psol, setPsol] = useState(""); 
    const [psolData, setPsolData] = useState(null);
    const [solData, setSolData] = useState(null);
   
    const [debouncedSol, setDebouncedSol] = useState(sol);
    const [debouncedPsol, setDebouncedPsol] = useState(psol);
  
     
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setDebouncedSol(sol);  
      }, 500);  
  
      return () => clearTimeout(timeoutId);  
    }, [sol]);
  
   
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setDebouncedPsol(psol); 
      }, 500);  
  
      return () => clearTimeout(timeoutId);  
    }, [psol]);
  
    
    useEffect(() => {
      if (debouncedSol) {

        let tx=debouncedSol;
        tx=0.95*tx


        axios
          .post("http://localhost:3000/getPSOL", { sol: tx })
          .then((response) => {
            console.log(response);
            setPsolData(response.data.psol);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }, [debouncedSol]);
   
    useEffect(() => {
      if (debouncedPsol) {

        let tx=debouncedPsol;
        tx=0.95*tx

        axios
          .post("http://localhost:3000/getSOL", { psol: tx })
          .then((response) => {
            console.log(response);
            setSolData(response.data.sol);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }, [debouncedPsol]);









    async function RequestSol() {
        console.log(wallet)

        if(!wallet.connected){


toast.error("Please Connect Your Wallet")
            return;
        }


        let amt=document.getElementById("sol").value
 

        const transaction=new Transaction();

        transaction.add(
          SystemProgram.transfer({
             
                fromPubkey: wallet.publicKey,
                
                toPubkey: new PublicKey("AkJwrYJtXMyWCFksYr9ist8L2iuUgbZDmu4kpMwf3aLf"),
                
                lamports: amt*1e9,
          })
        )

        await wallet.sendTransaction(transaction,connection);
//----------------
 



    }

async function RequestPSol() {


  if(!wallet.connected){


    toast.error("Please Connect Your Wallet")
                return;
              }
              return;
    
let amt=document.getElementById("psol").value

          const userATA=await  getAssociatedTokenAddress(
            new PublicKey("926TKECn5TFmncbYwjNbKtMcbQPYXn7foBbw147oemBj"),
            wallet.publicKey,
            false,
            TOKEN_2022_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
            

          )


          const myATA=await  getAssociatedTokenAddress(
            new PublicKey("926TKECn5TFmncbYwjNbKtMcbQPYXn7foBbw147oemBj"),
           new PublicKey("AkJwrYJtXMyWCFksYr9ist8L2iuUgbZDmu4kpMwf3aLf"),
            false,
            TOKEN_2022_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
            

          )

          console.log(myATA)

          const transaction=new Transaction();
          // const token = (connection, tokenMintAddress, TOKEN_PROGRAM_ID, wallet);
 
          transaction.add(
            Token.createTransferInstruction(
                TOKEN_2022_PROGRAM_ID,
                userATA,
                myATA,
                wallet.publicKey,
                [],
                amt * 1e9  // SPL tokens are usually divisible by 10^9
            )
        );
    
        // Send the transaction
        await wallet.sendTransaction(transaction, connection);

//  if()




}
    







  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-700 min-h-screen flex flex-col justify-center items-center text-white p-6">
              <div className="text-4xl font-bold mb-6">
                Welcome To <span className="text-yellow-400">P_SOL</span>, Stake Your Solana
              </div>
              <div className="text-lg mb-8 font-medium">
                Make sure you are connected to <span className="text-yellow-400">Devnet Mode</span>
              </div>

              <div className="flex flex-row space-x-14">
                <div className="w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Enter SOL Amount"
                    className="w-full mb-4 p-4 rounded-lg border-2 border-yellow-400 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    id="sol"
                    value={sol}
                    onChange={(e) => setSol(e.target.value)} // Update SOL state on input change
                  />
                  <input
                    type="text"
                    placeholder="You Will get"
                    className="w-full mb-4 p-4 rounded-lg border-2 border-yellow-400 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={psolData || ""} // Show PSOL data after debounce
                    readOnly
                  />
                  <button 
                  className="w-full bg-yellow-400 text-gray-900 font-semibold py-4 rounded-lg mt-6 transition-transform transform hover:scale-105 hover:bg-yellow-500"
                  onClick={RequestSol}
                  >
                    Stake SOL
                  </button>
                </div>

                {/* -------------------------------------------------------- */}

                <div className="w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Enter your wallet address"
                    className="w-full mb-4 p-4 rounded-lg border-2 border-yellow-400 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    id="psol"
                    value={psol}
                    onChange={(e) => setPsol(e.target.value)} // Update PSOL state on input change
                  />
                  <input
                    type="text"
                    placeholder="Enter staking amount"
                    className="w-full mb-4 p-4 rounded-lg border-2 border-yellow-400 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={solData || ""} // Show SOL data after debounce
                    readOnly
                  />
                  <button 
                  onClick={RequestPSol}
                  className="w-full bg-yellow-400 text-gray-900 font-semibold py-4 rounded-lg mt-6 transition-transform transform hover:scale-105 hover:bg-yellow-500">
                    Unstake SOL
                  </button>
                </div>
              </div>
              <ToastContainer />
            </div>
  )
}