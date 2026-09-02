import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { 
  Button, 
  Card, 
  CardContent, 
  IconButton, 
  Stack, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  TextField,
  Box,
  Typography,
  Chip,
  Avatar,
  Paper,
  Divider
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import BusinessIcon from '@mui/icons-material/Business'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AddBusinessIcon from '@mui/icons-material/AddBusiness'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import PageHeader from '../../components/PageHeader'

export default function EmpresasList() {
  const [items, setItems] = useState([])
  const { role } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', direccion: '', telefono: '', correo: '' })

  const load = async () => {
    const { data } = await api.get('/empresas')
    setItems(data || [])
  }
  useEffect(() => { load() }, []) // eslint-disable-line

  const onCreate = async () => {
    if (role !== 'administrador') return
    await api.post('/empresas', form)
    toast.success('Empresa creada')
    setForm({ nombre: '', direccion: '', telefono: '', correo: '' })
    load()
  }

  return (
    <Stack spacing={3}>
      <PageHeader title="Empresas" />
      
      {/* Card informativa */}
      <Card sx={{ 
        background: '#1B7576',
        color: 'white',
        boxShadow: '0 10px 30px rgba(27, 117, 118, 0.3)'
      }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <BusinessIcon sx={{ fontSize: 48, opacity: 0.9 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                Gestión de Empresas
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Administra la información de las empresas registradas en el sistema.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Formulario de creación */}
      {role === 'administrador' && (
        <Card sx={{ 
          border: '2px solid',
          borderColor: 'info.main',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <AddBusinessIcon color="info" sx={{ fontSize: 32 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Crear Nueva Empresa
              </Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <TextField 
                label="Nombre" 
                value={form.nombre} 
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                sx={{ flex: 1, minWidth: 200 }}
                variant="outlined"
              />
              <TextField 
                label="Dirección" 
                value={form.direccion} 
                onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))}
                sx={{ flex: 1, minWidth: 200 }}
                variant="outlined"
              />
              <TextField 
                label="Teléfono" 
                value={form.telefono} 
                onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
                sx={{ flex: 1, minWidth: 200 }}
                variant="outlined"
              />
              <TextField 
                label="Correo" 
                value={form.correo} 
                onChange={e => setForm(f => ({ ...f, correo: e.target.value }))}
                sx={{ flex: 1, minWidth: 200 }}
                variant="outlined"
              />
              <Button 
                variant="contained" 
                onClick={onCreate}
                startIcon={<AddBusinessIcon />}
                sx={{ 
                  minWidth: 150,
                  backgroundColor: '#1B7576',
                  '&:hover': {
                    backgroundColor: '#155a5b',
                  }
                }}
              >
                Crear Empresa
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Tabla de empresas */}
      <Card sx={{ 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: 2
      }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <BusinessIcon color="info" sx={{ fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Lista de Empresas
            </Typography>
            <Chip 
              label={`${items.length} empresa${items.length !== 1 ? 's' : ''}`} 
              color="info" 
              variant="outlined"
            />
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BusinessIcon fontSize="small" />
                      <span>Nombre</span>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationOnIcon fontSize="small" />
                      <span>Dirección</span>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PhoneIcon fontSize="small" />
                      <span>Teléfono</span>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmailIcon fontSize="small" />
                      <span>Correo</span>
                    </Stack>
                  </TableCell>
                  {role === 'administrador' && (
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      Acciones
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={role === 'administrador' ? 5 : 4} align="center" sx={{ py: 4 }}>
                      <Stack spacing={1} alignItems="center">
                        <BusinessIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                        <Typography variant="body1" color="text.secondary">
                          No hay empresas registradas
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map(e => (
                    <TableRow 
                      key={e.id}
                      hover
                      sx={{
                        '&:nth-of-type(even)': {
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(27, 117, 118, 0.08)',
                        },
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ 
                            bgcolor: 'info.main',
                            width: 32,
                            height: 32,
                            fontSize: '0.875rem',
                            color: 'white',
                          }}>
                            {e.nombre?.charAt(0)?.toUpperCase() || 'E'}
                          </Avatar>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {e.nombre}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocationOnIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {e.direccion}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {e.telefono}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {e.correo}
                          </Typography>
                        </Stack>
                      </TableCell>
                      {role === 'administrador' && (
                        <TableCell align="right">
                          <IconButton 
                            color="primary" 
                            onClick={() => navigate(`/empresas/${e.id}/editar`)}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                              }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>
        </CardContent>
      </Card>
    </Stack>
  )
}
