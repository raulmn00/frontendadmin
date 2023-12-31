import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTicket from "../hooks/ticket/useTicket.tsx";
import axios from "axios";
import urlApi from "../constants/UrlApi.ts";
import { TicketStatus } from "../types/models/models.ts";
import { toast } from "react-toastify";

export default function EditTicket() {
  const { ticketId } = useParams();
  const { getTicket } = useTicket();
  const ticket = getTicket(ticketId);
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const navigate = useNavigate();
  const [status, setStatus] = useState(ticket?.status);
  const growers = document.querySelectorAll(".grow-wrap");
  growers?.forEach((grower) => {
    const textarea = grower.querySelector("textarea");
    textarea?.addEventListener("input", () => {
      grower.dataset.replicatedValue = textarea.value;
    });
  });

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
        toast.success("Ticket editado com sucesso.", { autoClose: 1000 });
        setInterval(() => navigate(`/tickets/${ticketId}`), 1500);
      })
      .catch((error) => {
        console.log("useTicket -> updateTicket", error);
      });
  }

  return (
    <>
      <div className="ticket-form-container">
        <form onSubmit={handleEditTicket}>
          <div className="form-group">
            <label htmlFor="assunto">Assunto</label>
            <input
              type="text"
              id="assunto"
              className="form-control"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <label htmlFor="description">Descrição* </label>
          <div className="form-group grow-wrap">
            <textarea
              className="form-control"
              id="description"
              name="description"
              placeholder="Descrição do ticket..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              onInput={() =>
                "this.parentNode.dataset.replicatedValue = this.value"
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              className="status-select form-control"
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
              <option value="open">Aberto</option>
              <option value="closed">Encerrado</option>
              <option value="pending">Em atendimento</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Enviar
          </button>
        </form>
      </div>
    </>
  );
}
