import React, { useState } from "react"
import { TextField, Button, Stack } from "@mui/material"
import { coins } from "@cosmjs/stargate"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { fractionnft } from "fractionnft-js"

const CreateEventForm = ({ address, client }: any) => {
  const [eventName, setEventName] = useState("")
  const [id, setId] = useState("")
  const [description, setDescription] = useState<string>("")
  const [image, setImage] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [nftCreated, setNftCreated] = useState<boolean>(false)

  function handleSubmit(event: any) {
    event.preventDefault()
    createEventTransaction(eventName, id, description, image, category)
  }

  const createEventTransaction = async (
    eventName: string,
    id: string,
    description: string,
    image: string,
    category: string
  ) => {
    if (!address) {
      return
    }

    try {
      const msgCreateEvent =
        fractionnft.v1.MessageComposer.withTypeUrl.msgMintNFT({
          owner: address,
          name: eventName,
          id,
          description,
          image,
          category,
        })

      const fee = {
        amount: coins(1, "udmhackmos"),
        gas: "200000",
      }

      const result = await client.signAndBroadcast(
        address,
        [msgCreateEvent],
        fee
      )
      if (result.code === 0) {
        toast("Event created!")
      } else {
        toast("Failed")
      }
      console.log(result)
      if (result.code === 0) {
        setNftCreated(true)
      }
      // assertIsBroadcastTxSuccess(result);
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <React.Fragment>
      {!nftCreated && (
        <>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2} direction="column" sx={{ marginBottom: 4 }}>
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Event Name"
                onChange={(e) => setEventName(e.target.value)}
                value={eventName}
                required
              />
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Event Id"
                onChange={(e) => setId(e.target.value)}
                value={id}
                required
              />
              <TextField
                type="number"
                variant="outlined"
                color="secondary"
                label="NFT price"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                required
              />
              <TextField
                type="number"
                variant="outlined"
                color="secondary"
                label="Token Price"
                onChange={(e) => setImage(e.target.value)}
                value={image}
                required
              />
              <TextField
                type="number"
                variant="outlined"
                color="secondary"
                label="Token Supply"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                required
              />
            </Stack>
            <Button variant="outlined" color="secondary" type="submit">
              Create NFT
            </Button>
          </form>
        </>
      )}
    </React.Fragment>
  )
}

export default CreateEventForm
