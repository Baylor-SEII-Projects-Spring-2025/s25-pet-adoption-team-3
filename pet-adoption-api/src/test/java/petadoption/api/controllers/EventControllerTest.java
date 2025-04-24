package petadoption.api.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import petadoption.api.DTO.EventDetailsDTO;
import petadoption.api.DTO.EventRequestDTO;
import petadoption.api.models.Event;
import petadoption.api.models.User;
import petadoption.api.services.EventService;
import petadoption.api.services.SessionValidation;

import jakarta.servlet.http.HttpSession;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.http.HttpStatus.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

        when(sessionValidation.validateSession(any(HttpSession.class), eq(User.Role.ADOPTION_CENTER)))
                .thenReturn((ResponseEntity) ResponseEntity.ok(adoptionCenter));
    }

    @Test
    void testCreateEvent_Success() throws IOException {
        when(sessionValidation.validateSession(any(HttpSession.class), eq(User.Role.ADOPTION_CENTER)))
                .thenReturn((ResponseEntity) ResponseEntity.ok(adoptionCenter));

        Event event = new Event(); // assuming this is a mock or stub
        event.setTitle("Adoption Fair");
        event.setAdoptionCenter(adoptionCenter);

        when(eventService.createEventWithImage(
                eq(adoptionCenter),
                eq(1L),
                anyString(),
                anyString(),
                any(LocalDate.class),
                any(LocalDate.class),
                any()
        )).thenReturn(event);

        ResponseEntity<EventDetailsDTO> response = eventController.createEventWithImage(
                session,
                1L,
                "Adoption Fair",
                "Join us for a pet adoption event!",
                LocalDate.of(2025, 3, 20),
                LocalDate.of(2025, 3, 22),
                null  // You can use a mock MultipartFile here if needed
        );

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Adoption Fair", response.getBody().getTitle());
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

    @Test
    void testGetAllEvents() {
        List<Event> eventList = new ArrayList<>();
        Event event = new Event();
        event.setId(1L);
        event.setTitle("Adoption Day");
        eventList.add(event);

        when(eventService.getAllEvents()).thenReturn(eventList);

        ResponseEntity<?> response = eventController.getAllEvents();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(eventList, response.getBody());
    }

    @Test
    void testGetEventsByAdoptionCenterId() {
        List<Event> events = new ArrayList<>();
        Event e1 = new Event();
        e1.setId(3L);
        e1.setTitle("Rescue Rally");
        events.add(e1);

        when(eventService.getEventsByAdoptionCenterId(1L)).thenReturn(events);

        ResponseEntity<?> response = eventController.getAllEvents(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(events, response.getBody());
    }

}
