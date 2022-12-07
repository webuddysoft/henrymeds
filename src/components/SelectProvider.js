import { FormControl, InputLabel, MenuItem, Select, Skeleton, Stack, Typography } from "@mui/material"

export default function SelectProvider({providers, selectProviderHandler}) {
  return (
    <Stack gap={1}>
      <Typography variant="h3">Login as</Typography>
      {
        providers === null ? 
            <Skeleton height={80} /> :
            <FormControl>
              <InputLabel id="provider-dropdown-label">Select a Provider</InputLabel>
              <Select 
                labelId="provider-dropdown-label"
                label="Select a Provider"
                onChange={(e) => {selectProviderHandler(e.target.value)}}
                value={""}
              >
                {providers.map((c, i) => <MenuItem key={`item${i}`} value={c.id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
      }
    </Stack>
  )
}