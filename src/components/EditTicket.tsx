import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTicket from "../hooks/ticket/useTicket.tsx";
import axios from "axios";
import urlApi from "../constants/UrlApi.ts";
import { TicketStatus } from "../types/models/models.ts";

export default function EditTicket() {
  const { ticketId } = useParams();
  const { getTicket } = useTicket();
  const ticket = getTicket(ticketId);
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const navigate = useNavigate();
  const [status, setStatus] = useState(ticket?.status);

  useEffect(() => {
    if (ticket) {
      setSubject(ticket.subject);
      setDescription(ticket.description);
      setStatus(ticket.status);
    }
  }, [ticket]);
  async function handleEditTicket(e) {
    e.preventDefault();
    const payload = { description, subject, status };
    const api = axios.create({ baseURL: urlApi });
    const token = localStorage.getItem("authToken");
    api
      .patch(`/ticket/${ticketId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        navigate(`/tickets/${ticketId}`);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("useTicket -> updateTicket", error);
      });
  }

  return (
    <>
      <div>
        <form onSubmit={handleEditTicket}>
          <div>
            <label htmlFor="assunto">Assunto</label>
            <input
              type="text"
              id="assunto"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="status">Status</label>
            <select
              className="status-select"
              value={status}
              onChange={(e) => {
                if (e.target.value == "open") {
                  setStatus(TicketStatus.open);
                }
                if (e.target.value == "closed") {
                  setStatus(TicketStatus.closed);
                }
                if (e.target.value == "pending") {
                  setStatus(TicketStatus.pending);
                }
              }}
            >
              <option value=""></option>
              <option value="open">Aberto</option>
              <option value="closed">Encerrado</option>
              <option value="pending">Em atendimento</option>
            </select>
          </div>

          <button type="submit">Enviar</button>
        </form>
      </div>
    </>
  );
}