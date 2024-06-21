# adapted from https://programminghistorian.org/en/lessons/shiny-leaflet-newspaper-map-tutorial

library(tidyverse)
library(shiny)
library(sf)
library(leaflet)
library(shinyWidgets)

interviewees <- read_tsv('geocoded_addresses.tsv')

ui <- fluidPage(
  titlePanel("MapScaping Map"),
  sidebarLayout(
    sidebarPanel(
      sliderInput('episode', 'Episode numbers', min = 1, max = 226, value = c(20, 70)),
      pickerInput('categories', 'Categories', choices = NULL, selected = NULL, multiple = TRUE,
                  options = pickerOptions(actionsBox = TRUE, liveSearch = TRUE))
    ),
    mainPanel(
      leafletOutput(outputId = 'map')
    )
  )
)

server <- function(input, output, session) {
  # Update category choices based on available categories in the data
  observe({
    categories <- interviewees %>%
      select(Categories) %>%
      distinct() %>%
      separate_rows(Categories, sep = ",") %>%
      mutate(Categories = str_trim(Categories)) %>%
      filter(!is.na(Categories) & Categories != "") %>%
      pull(Categories) %>%
      unique()
    
    updatePickerInput(session, 'categories', choices = sort(categories))
  })
  
  map_df <- reactive({
    df <- interviewees %>%
      filter(!is.na(longitude) & !is.na(latitude)) %>%
      filter(Episode >= input$episode[1] & Episode <= input$episode[2])
    
    if (!is.null(input$categories) && length(input$categories) > 0) {
      df <- df %>%
        filter(str_detect(Categories, paste(input$categories, collapse = "|")))
    }
    
    df %>%
      mutate(
        longitude = jitter(longitude, factor = 0.3),
        latitude = jitter(latitude, factor = 0.3),
        popup_info = paste0(
          "Title: ", Title, "<br>",
          "Interviewee: <a href='", interviewee_link, "' target='_blank'>", full_name, "</a><br>",
          "Company: <a href='", company_link, "' target='_blank'>", company_name, "</a><br>",
          "Position: ", position
        ),
        color = case_when(
          gender == 'm' ~ 'blue',
          gender == 'f' ~ 'red',
          gender == 'n' ~ 'green',
          TRUE ~ 'gray'  # default color for any other or missing values
        )
      ) %>%
      st_as_sf(coords = c('longitude', 'latitude')) %>%
      st_set_crs(4326)
  })
  
  output$map <- renderLeaflet({
    leaflet() %>%
      addTiles() %>%
      setView(lng = -5, lat = 54, zoom = 1) %>%
      addCircleMarkers(data = map_df(), radius = ~(4 + number_of_interviews) * 1.5,
                       popup = ~popup_info,
                       color = ~color,  # Set the marker color based on the 'color' column
                       fillColor = ~color,  # Fill the marker with the specified color
                       fillOpacity = 0.8,  # Set fill opacity
                       stroke = FALSE,  # Remove marker border,
                       popupOptions = popupOptions(closeButton = FALSE)
      )
  })
}

shinyApp(ui, server)
