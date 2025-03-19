package petadoption.api.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import petadoption.api.DTO.EventRequestDTO;
import petadoption.api.models.User;
import petadoption.api.services.EventService;
import petadoption.api.services.SessionValidation;

import jakarta.servlet.http.HttpSession;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.http.HttpStatus.*;
import java.time.LocalDate;

class EventControllerTest {

    @InjectMocks
    private EventController eventController;

    @Mock
    private EventService eventService;

    @Mock
    private HttpSession session;

    @Mock
    private SessionValidation sessionValidation;

    private User adoptionCenter;
    private EventRequestDTO eventRequestDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        adoptionCenter = new User();
        adoptionCenter.setId(1L);
        adoptionCenter.setRole(User.Role.ADOPTION_CENTER);

        eventRequestDTO = new EventRequestDTO();
        eventRequestDTO.setTitle("Adoption Fair");
        eventRequestDTO.setDescription("Join us for a pet adoption event!");
        eventRequestDTO.setImage("some-image-url");
        eventRequestDTO.setStartDate(LocalDate.parse("2025-03-20"));
        eventRequestDTO.setEndDate(LocalDate.parse("2025-03-22"));

        // ✅ Fix: Mock session validation response to avoid NullPointerException
        when(sessionValidation.validateSession(any(HttpSession.class), eq(User.Role.ADOPTION_CENTER)))
                .thenReturn((ResponseEntity) ResponseEntity.ok(adoptionCenter));
    }

    @Test
    void testCreateEvent_Success() {
        when(session.getAttribute("user")).thenReturn(adoptionCenter);
        when(eventService.createEvent(1L, eventRequestDTO)).thenReturn(true);

        ResponseEntity<String> response = eventController.createEvent(session, 1L, eventRequestDTO);

        assertEquals(CREATED, response.getStatusCode());
        assertEquals("Event created successfully.", response.getBody());
    }

    @Test
    void testEditEvent_Success() {
        when(session.getAttribute("user")).thenReturn(adoptionCenter);
        when(eventService.editEvent(1L, 1L, eventRequestDTO)).thenReturn(true);

        ResponseEntity<String> response = eventController.editEvent(session, 1L, 1L, eventRequestDTO);

        assertEquals(OK, response.getStatusCode());
        assertEquals("Event edited successfully.", response.getBody());
    }

    @Test
    void testDeleteEvent_Success() {
        when(session.getAttribute("user")).thenReturn(adoptionCenter);
        when(eventService.deleteEvent(1L, 1L)).thenReturn(true);

        ResponseEntity<String> response = eventController.deleteEvent(session, 1L, 1L);

        assertEquals(OK, response.getStatusCode());
        assertEquals("Event deleted successfully.", response.getBody());
    }
}
