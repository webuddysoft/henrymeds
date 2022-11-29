import { Stack, Typography } from "@mui/material";

export default function Timer() {
  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentTimezoneOffset = -1 * (new Date().getTimezoneOffset() / 60);

  return (
    <Stack>
      <Typography>
        Timezone: {`(UTC${currentTimezoneOffset > 0 ? '+' : '-'}${currentTimezoneOffset}) ${currentTimezone}`}
      </Typography>
    </Stack>
  )
}