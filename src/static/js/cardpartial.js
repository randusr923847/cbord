const cardpartial = `
<div id="card-<%= event.id %>" class="card">
  <div class="card-img">
    <img src="../static/images/<%= event.image %>" alt="..." />
  </div>

  <div class="card-body">
    <p class="card-time"><%= event.start %></p>
    <h2 class="card-title"><%= event.title %></h2>
    <p class="card-org">By <%= event.org %></p>
    <p class="card-loc">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="14"
        fill="currentColor"
        class="bi bi-geo-alt"
        viewBox="0 -6 16 22"
      >
        <path
          d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"
        />
        <path
          d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"
        />
      </svg>
      <%= event.loc %>
    </p>
    <div class="card-tags">
      <% for(let i = 0; i < event.tags.length; i++) { %>
      <p><%= event.tags[i] %></p>
      <% } %>
    </div>
  </div>
</div>
`;