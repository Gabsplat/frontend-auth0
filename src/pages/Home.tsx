import {
  Star,
  Shield,
  Users,
  Smile,
  Heart,
  Sparkles,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLogin } from "@/auth/useLogin";


const specialties = [
  {
    name: "Ortodoncia",
    description: "Corrección de malposiciones dentales y maxilares",
    icon: Smile,
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    name: "Implantología",
    description: "Reemplazo de dientes perdidos con implantes de titanio",
    icon: Shield,
    color: "bg-green-50 text-green-600 border-green-200",
  },
  {
    name: "Endodoncia",
    description: "Tratamiento de conductos radiculares",
    icon: Heart,
    color: "bg-red-50 text-red-600 border-red-200",
  },
  {
    name: "Periodoncia",
    description: "Tratamiento de encías y tejidos de soporte",
    icon: Sparkles,
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    name: "Odontopediatría",
    description: "Cuidado dental especializado para niños",
    icon: Users,
    color: "bg-yellow-50 text-yellow-600 border-yellow-200",
  },
  {
    name: "Estética Dental",
    description: "Blanqueamientos y carillas estéticas",
    icon: Sparkles,
    color: "bg-pink-50 text-pink-600 border-pink-200",
  },
];

const reviews = [
  {
    name: "María González",
    rating: 5,
    comment:
      "Excelente atención, el Dr. Martínez es muy profesional y me explicó todo el tratamiento paso a paso. Recomiendo 100%.",
    treatment: "Implante dental",
    date: "Hace 2 semanas",
  },
  {
    name: "Carlos Rodríguez",
    rating: 5,
    comment:
      "Después de años de tener miedo al dentista, aquí me sentí muy cómodo. El equipo es increíble y las instalaciones son de primera.",
    treatment: "Limpieza dental",
    date: "Hace 1 mes",
  },
  {
    name: "Ana Pérez",
    rating: 5,
    comment:
      "Mi hija de 8 años salió encantada de su primera consulta. La doctora tiene una paciencia increíble con los niños.",
    treatment: "Odontopediatría",
    date: "Hace 3 días",
  },
];

const stats = [
  { number: "15+", label: "Años de experiencia" },
  { number: "5000+", label: "Pacientes satisfechos" },
  { number: "98%", label: "Tasa de éxito" },
  { number: "24/7", label: "Emergencias" },
];

export default function Home() {
  const login = useLogin();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      {/* Header */}

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-green-600/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 rounded-full">
                  <Award className="w-4 h-4 mr-2" />
                  Clínica Certificada ISO 9001
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-slate-800 leading-tight">
                  Tu sonrisa perfecta
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                    comienza aquí
                  </span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Tecnología de vanguardia, profesionales expertos y un enfoque
                  humano para brindarte la mejor experiencia dental. Más de 15
                  años cuidando sonrisas.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={login}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Reservar Turno
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-slate-300 hover:border-blue-600 hover:text-blue-600 px-8 py-4 rounded-full transition-all duration-300 bg-transparent"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Llamar Ahora
                </Button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-blue-600">
                      {stat.number}
                    </div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                <img
                  src="/consultorio.jpg"
                  alt="Consultorio dental moderno"
                  width={500}
                  height={600}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          Instalaciones Modernas
                        </p>
                        <p className="text-sm text-slate-600">
                          Tecnología de última generación
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Especialidades */}
      <section id="especialidades" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 rounded-full mb-4">
              Nuestras Especialidades
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Servicios Integrales de Salud Dental
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Contamos con especialistas certificados en todas las áreas de la
              odontología moderna
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialties.map((specialty, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 rounded-2xl ${specialty.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <specialty.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {specialty.name}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {specialty.description}
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-4 p-0 h-auto text-blue-600 hover:text-blue-700 group-hover:translate-x-2 transition-transform duration-300"
                  >
                    Más información
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reseñas */}
      <section
        id="reseñas"
        className="py-20 bg-gradient-to-br from-slate-50 to-blue-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-2 rounded-full mb-4">
              Testimonios
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Lo que dicen nuestros pacientes
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              La confianza de nuestros pacientes es nuestro mayor logro
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {review.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {review.treatment}
                        </p>
                      </div>
                      <p className="text-xs text-slate-400">{review.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=800')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              ¿Listo para transformar tu sonrisa?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Únete a miles de pacientes satisfechos. Agenda tu consulta hoy
              mismo y descubre por qué somos la clínica dental de confianza.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={login}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Crear Cuenta Paciente
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-full transition-all duration-300 bg-transparent"
              >
                <Phone className="w-5 h-5 mr-2" />
                +54 11 1234-5678
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Smile className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">DentalCare Pro</h3>
                  <p className="text-sm text-slate-400">
                    Tu sonrisa, nuestra pasión
                  </p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Más de 15 años brindando servicios odontológicos de excelencia
                con tecnología de vanguardia.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-400">
                    Av. Corrientes 1234, CABA
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-400">+54 11 1234-5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-400">info@dentalcarepro.com</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Horarios</h4>
              <div className="space-y-2 text-slate-400">
                <div className="flex justify-between">
                  <span>Lun - Vie:</span>
                  <span>8:00 - 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados:</span>
                  <span>9:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingos:</span>
                  <span>Emergencias</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Acceso Rápido</h4>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 p-2"
                  onClick={login}
                >
                  Portal Pacientes
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 p-2"
                  onClick={login}
                >
                  Portal Profesionales
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 p-2"
                  onClick={login}
                >
                  Administración
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 DentalCare Pro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// function Home() {
//   const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
//   console.log(
//     import.meta.env.VITE_AUTH0_AUDIENCE,
//     import.meta.env.VITE_API_URL
//   );
//   const callApi = async () => {
//     try {
//       const token = await getAccessTokenSilently({
//         authorizationParams: {
//           audience: import.meta.env.VITE_AUTH0_AUDIENCE,
//         },
//       });

//       console.log("Access Token:", token);

//       // Llamar al endpoint de login en el backend
//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}api/auth/login`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             auth0Id: user.sub, // ID único del usuario proporcionado por Auth0
//             nombre: user.given_name || user.name || "Default", // Nombre del usuario
//             email: user.email, // Email del usuario
//           }),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Response from backend:", data);
//       } else {
//         console.error("Error from backend:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error calling API:", error);
//     }
//   };

//   const printToken = async () => {
//     console.log("👉 printToken clicked");
//     try {
//       const token = await getAccessTokenSilently({
//         authorizationParams: {
//           audience: import.meta.env.VITE_AUTH0_AUDIENCE,
//         },
//       });
//       console.log("Access Token:", token);
//     } catch (e) {
//       console.error("Error getting token:", e);
//     }
//   };

//   return (
//     <>
//       <h1 className="text-3xl font-bold underline">Hola</h1>
//       <LoginButton />
//       {isAuthenticated && (
//         <button onClick={callApi} className="mt-4 p-2 bg-blue-500 text-white">
//           Call API
//         </button>
//       )}
//       {isAuthenticated && (
//         <button
//           onClick={printToken}
//           className="mt-4 p-2 bg-blue-500 text-white"
//         >
//           Mostrar token
//         </button>
//       )}
//     </>
//   );
// }
