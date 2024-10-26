import React, { useState } from "react"
import { TextField, Button, Stack } from "@mui/material"
import { ems } from "ems-chain-js"
import { coins } from "@cosmjs/stargate"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { cosmos } from "fractionnft-js"

const QueryEvent = ({ address, client }: any) => {
  const [event, setEvent] = useState<any>()
  const [id, setId] = useState<string | null>(null)
  function handleSubmit(event: any) {
    event.preventDefault()
    if (id) queryEvent(id)
  }

  const purchaseTicketTransaction = async (nft: boolean) => {
    if (!id) return
    try {
      const msgIssueEventNFT =
        ems.v1.MessageComposer.withTypeUrl.msgIssueEventNFT({
          receiver: address,
          id,
          nft,
        })
      console.log(event)
      const fee = {
        amount: coins(nft ? event.nft_price : event.token_price, "udmhackmos"),
        gas: "200000",
      }

      const result = await client.signAndBroadcast(
        address,
        [msgIssueEventNFT],
        fee
      )
      if (result.code === 0) {
        toast("Issuance success!")
      } else {
        toast("Not Found")
      }
      console.log(result)
    } catch (err) {
      console.error(err)
    }
  }

  const queryEvent = async (id: string) => {
    if (!address) {
      return
    }

    try {
      const qclient = await ems.ClientFactory.createLCDClient({
        restEndpoint: "http://localhost:1317",
      })
      const result = await qclient.ems.v1.getEvent({
        id: id,
      })
      if (result.event) {
        toast("Query success!")
      } else {
        toast("Not Found")
      }
      setEvent(result.event)
      // assertIsBroadcastTxSuccess(result);
    } catch (err) {
      console.error(err)
    }
  }

  const queryNFTs = async () => {
    try {
      const qclient = await cosmos.ClientFactory.createLCDClient({
        restEndpoint: "http://localhost:1317",
      })
      const result = await qclient.cosmos.nft.v1beta1.nFTs({
        owner: address!,
        classId: "Real_Estate",
      })
      console.log(result)
      //   setItems(result.event)
      // assertIsBroadcastTxSuccess(result);
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} style={{ marginTop: 50 }}>
        <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
          <TextField
            type="text"
            variant="outlined"
            color="secondary"
            label="Event Id"
            onChange={(e) => {
              setEvent(null)
              setId(e.target.value)
            }}
            value={id}
            required
          />
          <Button variant="outlined" color="secondary" type="submit">
            Query Event
          </Button>
        </Stack>

        {event && (
          <div>
            <pre>{JSON.stringify(event, null, 2)}</pre>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => purchaseTicketTransaction(true)}
              style={{ margin: 15 }}
            >
              Purchase NFT
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => purchaseTicketTransaction(false)}
            >
              Purchase Token
            </Button>
          </div>
        )}
      </form>
    </React.Fragment>
  )
}

export default QueryEvent
