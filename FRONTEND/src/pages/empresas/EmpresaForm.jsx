import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { 
  Button, 
  Card, 
  CardContent, 
  Stack, 
  TextField, 
  Typography,
  Divider,
  Box
} from '@mui/material'
import { toast } from 'sonner'
import PageHeader from '../../components/PageHeader'
import BusinessIcon from '@mui/icons-material/Business'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function EmpresaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [empresaInfo, setEmpresaInfo] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: ''
  })

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const { data } = await api.get(`/empresas/${id}`)
        setEmpresaInfo({
          nombre: data.nombre || '',
          direccion: data.direccion || '',
          telefono: data.telefono || '',
          correo: data.correo || ''
        })
      } catch (error) {
        toast.error('Error al cargar empresa')
      }
    })()
  }, [id])

  const onUpdateEmpresa = async () => {
    if (!empresaInfo.nombre || !empresaInfo.direccion || !empresaInfo.telefono || !empresaInfo.correo) {
      toast.error('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    try {
      await api.put(`/empresas/${id}`, {
        nombre: empresaInfo.nombre,
        direccion: empresaInfo.direccion,
        telefono: empresaInfo.telefono,
        correo: empresaInfo.correo
      })
      toast.success('Información de la empresa actualizada')
    } catch (error) {
      // El error ya se maneja en el interceptor
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack spacing={3}>
      <PageHeader 
        title="Editar Empresa"
        actions={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            data-testid="button-empresa-volver"
            onClick={() => navigate(-1)}
            sx={{
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              }
            }}
          >
            Volver
          </Button>
        }
      />
      
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
                Editar Información de la Empresa
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Actualiza los datos de la empresa en el sistema.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Información de la empresa */}
      <Card sx={{ 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: 2
      }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <EditIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Información de la Empresa
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <TextField
                label="Nombre"
                value={empresaInfo.nombre}
                onChange={e => setEmpresaInfo({ ...empresaInfo, nombre: e.target.value })}
                inputProps={{ "data-testid": "input-empresa-nombre" }}
                sx={{ flex: 1, minWidth: 200 }}
                variant="outlined"
                fullWidth
                required
              />
              <TextField
                label="Dirección"
                value={empresaInfo.direccion}
                onChange={e => setEmpresaInfo({ ...empresaInfo, direccion: e.target.value })}
                inputProps={{ "data-testid": "input-empresa-direccion" }}
                sx={{ flex: 1, minWidth: 200 }}
                variant="outlined"
                fullWidth
                required
              />
            </Stack>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <TextField
                label="Teléfono"
                value={empresaInfo.telefono}
                onChange={e => setEmpresaInfo({ ...empresaInfo, telefono: e.target.value })}
                inputProps={{ "data-testid": "input-empresa-telefono" }}
                sx={{ flex: 1, minWidth: 200 }}
                variant="outlined"
                fullWidth
                required
              />
              <TextField
                label="Correo"
                type="email"
                value={empresaInfo.correo}
                onChange={e => setEmpresaInfo({ ...empresaInfo, correo: e.target.value })}
                inputProps={{ "data-testid": "input-empresa-correo" }}
                sx={{ flex: 1, minWidth: 200 }}
                variant="outlined"
                fullWidth
                required
              />
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                data-testid="button-empresa-cancelar"
                onClick={() => navigate(-1)}
                sx={{
                  minWidth: 120,
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  }
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                data-testid="button-empresa-guardar"
                onClick={onUpdateEmpresa}
                disabled={loading}
                startIcon={<EditIcon />}
                sx={{ 
                  minWidth: 180,
                  backgroundColor: '#1B7576',
                  '&:hover': {
                    backgroundColor: '#155a5b',
                  }
                }}
              >
                Actualizar Información
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

