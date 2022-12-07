import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function MyBreadcrumbs({links}) {
  return (
    <Breadcrumbs>
      <Link component={RouterLink} to="/">
        Home
      </Link>
      {links.map((item, i) => {
        return !item.onClick ? <Typography key={`bi${i}`} color="text.primary">{item.title}</Typography> : 
                               <Link key={`bi${i}`} onClick={item.onClick} sx={{cursor: "pointer"}}>{item.title}</Link>
      })}
    </Breadcrumbs>
  );  
}