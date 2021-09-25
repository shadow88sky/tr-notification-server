import { Injectable, OnModuleInit } from '@nestjs/common';
import Web3 from 'web3';
import * as sUSD_ABI from '../../contracts/abis/sUSD.json';

@Injectable()
export class TransactionService implements OnModuleInit {
  onModuleInit() {}

  /**
   * watchEtherTransfers
   *
   */
  async watchEtherTransfers() {
    // Instantiate web3 with WebSocket provider
    const web3 = new Web3(
      new Web3.providers.WebsocketProvider(
        'wss://kovan.infura.io/ws/v3/',
      ),
    );

    // Instantiate subscription object
    const subscription = web3.eth.subscribe('pendingTransactions');

    // Subscribe to pending transactions
    subscription
      .subscribe((error, result) => {
        if (error) console.log(error);
      })
      .on('data', async (txHash) => {
        try {
          // Instantiate web3 with HttpProvider
          const web3Http = new Web3(
            'wss://kovan.infura.io/ws/v3/13229d80a2234ca4acebbb2a11f3b826',
          );

          // Get transaction details
          const trx = await web3Http.eth.getTransaction(txHash);

          console.log('trx', trx);

          // const valid = validateTransaction(trx)
          // If transaction is not valid, simply return
          //  if (!valid) return

          //   console.log(
          //     'Found incoming Ether transaction from ' +
          //       process.env.WALLET_FROM +
          //       ' to ' +
          //       process.env.WALLET_TO,
          //   );
          //   console.log('Transaction value is: ' + process.env.AMOUNT);
          //   console.log('Transaction hash is: ' + txHash + '\n');

          // Initiate transaction confirmation
          // confirmEtherTransaction(txHash)

          // Unsubscribe from pending transactions.
          // subscription.unsubscribe();
        } catch (error) {
          console.log(error);
        }
      });
  }

  /**
   * watchTokenTransfers
   *
   */
  async watchTokenTransfers() {
    // Instantiate web3 with WebSocketProvider
    const web3 = new Web3(
      new Web3.providers.WebsocketProvider(
        'wss://kovan.infura.io/ws/v3/',
      ),
    );

    // Instantiate token contract object with JSON ABI and address
    const tokenContract = new web3.eth.Contract(
      sUSD_ABI as any,
      process.env.TOKEN_CONTRACT_ADDRESS,
    );

    // Generate filter options
    const options = {
      // filter: {
      //   _from:  process.env.WALLET_FROM,
      //   _to:    process.env.WALLET_TO,
      //   _value: process.env.AMOUNT
      // },
      // fromBlock: 'latest'
    };

    // Subscribe to Transfer events matching filter criteria
    tokenContract.events.Transfer(options, async (error, event) => {
      if (error) {
        console.log(error);
        return;
      }

      console.log(
        'Found incoming Pluton transaction from ' +
          process.env.WALLET_FROM +
          ' to ' +
          process.env.WALLET_TO +
          '\n',
      );
      console.log('Transaction value is: ' + process.env.AMOUNT);
      // console.log('Transaction hash is: ' + txHash + '\n')

      // Initiate transaction confirmation
      // confirmEtherTransaction(event.transactionHash)

      return;
    });
  }
}
