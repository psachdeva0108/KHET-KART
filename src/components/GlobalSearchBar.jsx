import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import SearchIcon from '@mui/icons-material/Search'
import { searchAll } from '../services/productService'

function toOptions({ products, farmers, fpos }) {
  return [
    ...products.map((p) => ({ group: 'Products', label: `${p.name} — ${p.farmer?.name}`, to: `/product/${p.id}` })),
    ...farmers.map((f) => ({ group: 'Farmers', label: `${f.name} (${f.farmName})`, to: `/farmer/${f.id}` })),
    ...fpos.map((f) => ({ group: 'FPOs', label: f.name, to: `/fpo/${f.id}` })),
  ]
}

// product-spec §11/§46: global search across products, farmers and FPOs.
// Rendered as one seamless white pill (input + button share a container)
// to match the reference design rather than two separate boxed controls.
export default function GlobalSearchBar({ maxWidth = 600 }) {
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState([])

  useEffect(() => {
    if (!inputValue.trim()) {
      setOptions([])
      return undefined
    }
    let active = true
    const timer = setTimeout(() => {
      searchAll(inputValue).then((result) => {
        if (active) setOptions(toOptions(result))
      })
    }, 200)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [inputValue])

  function goToMarketplace() {
    navigate(`/marketplace?q=${encodeURIComponent(inputValue)}`)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth,
        mx: 'auto',
        height: 58,
        bgcolor: 'background.paper',
        borderRadius: '14px',
        boxShadow: '0 12px 32px rgba(20,60,40,0.1)',
        pl: 2.5,
        pr: 1,
      }}
    >
      <SearchIcon color="action" sx={{ mr: 1, flexShrink: 0 }} />
      <Autocomplete
        freeSolo
        fullWidth
        options={options}
        groupBy={(option) => option.group}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
        inputValue={inputValue}
        onInputChange={(_, value) => setInputValue(value)}
        onChange={(_, value) => {
          if (value && typeof value !== 'string') navigate(value.to)
        }}
        sx={{ flexGrow: 1 }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="Search products, farmers or FPOs..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') goToMarketplace()
            }}
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              sx: { fontSize: 15 },
            }}
          />
        )}
      />
      <Button
        variant="contained"
        onClick={goToMarketplace}
        sx={{ flexShrink: 0, ml: 1, padding: '12px 22px', fontSize: 14 }}
      >
        Search
      </Button>
    </Box>
  )
}
