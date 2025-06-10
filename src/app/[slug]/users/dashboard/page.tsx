"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { DatePicker } from "@/components/ui/DatePicker";
import { Select } from "@/components/ui/Select";
import { Service } from "@/types/service";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const mockBranchData = [
  { name: "Centro", revenue: 12000, services: 240 },
  { name: "Norte", revenue: 9500, services: 180 },
  { name: "Sur", revenue: 7800, services: 160 },
];

const mockUserData = [
  { name: "Ana", services: 120 },
  { name: "Juan", services: 80 },
  { name: "Pedro", services: 60 },
];

const mockCustomerData = [
  { name: "Recurrentes", value: 200 },
  { name: "Nuevos", value: 50 },
];

const mockServicesToday = [
  {
    id: 1,
    customer: "Carlos Méndez",
    user: "Ana",
    service: "Corte de Cabello",
    amount: 20,
    date: "2025-06-04",
    time: "10:00",
    paymentType: "Efectivo",
  },
  {
    id: 2,
    customer: "Laura Ríos",
    user: "Juan",
    service: "Manicure",
    amount: 15,
    date: "2025-06-04",
    time: "11:30",
    paymentType: "Tarjeta",
  },
];

const COLORS = ["#3dd9eb", "#f55376"];

export default function DashboardPage() {
  const [branch, setBranch] = useState("Todos");
  const [dateRange, setDateRange] = useState<{ from: string | null; to: string | null }>({ from: null, to: null });
  const [sortField, setSortField] = useState<keyof Service>("date");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const sortedServices = useMemo(() => {
    return [...mockServicesToday].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      return valA > valB ? 1 : -1;
    });
  }, [sortField]);

  const paginatedServices = sortedServices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(mockServicesToday.length / pageSize);

  return (
    <div className="flex flex-col justify-center p-2 space-y-6 min-w-7xl mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <Select value={branch} onValueChange={setBranch}>
          <option value="Todos">Todas las sucursales</option>
          <option value="Centro">Centro</option>
          <option value="Norte">Norte</option>
          <option value="Sur">Sur</option>
        </Select>
        <DatePicker
          from={dateRange.from}
          to={dateRange.to}
          onChange={setDateRange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">
              Ingresos por Sucursal
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockBranchData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3dd9eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">
              Servicios por Usuario
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockUserData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="services" fill="#f55376" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">Tipo de Clientes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockCustomerData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {mockCustomerData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Servicios del Día</h3>
          <div className="overflow-auto">
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th
                    className="p-2 cursor-pointer"
                    onClick={() => setSortField("customer")}
                  >
                    Cliente
                  </th>
                  <th
                    className="p-2 cursor-pointer"
                    onClick={() => setSortField("user")}
                  >
                    Usuario
                  </th>
                  <th
                    className="p-2 cursor-pointer"
                    onClick={() => setSortField("service")}
                  >
                    Servicio
                  </th>
                  <th
                    className="p-2 cursor-pointer"
                    onClick={() => setSortField("amount")}
                  >
                    Monto
                  </th>
                  <th
                    className="p-2 cursor-pointer"
                    onClick={() => setSortField("date")}
                  >
                    Fecha
                  </th>
                  <th
                    className="p-2 cursor-pointer"
                    onClick={() => setSortField("time")}
                  >
                    Hora
                  </th>
                  <th
                    className="p-2 cursor-pointer"
                    onClick={() => setSortField("paymentType")}
                  >
                    Pago
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedServices.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-gray-700 hover:bg-gray-900"
                  >
                    <td className="p-2">{service.customer}</td>
                    <td className="p-2">{service.user}</td>
                    <td className="p-2">{service.service}</td>
                    <td className="p-2">${service.amount}</td>
                    <td className="p-2">{service.date}</td>
                    <td className="p-2">{service.time}</td>
                    <td className="p-2">{service.paymentType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
