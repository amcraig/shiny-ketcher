# pyright: basic

from shiny import App, ui
from shiny_ketcher import (
    input_shiny_ketcher,
    output_shiny_ketcher,
    render_shiny_ketcher,
)

app_ui = ui.page_fluid(
    ui.h2("Color picker"),
    input_shiny_ketcher("color"),
    ui.br(),
    ui.h2("Output color"),
    output_shiny_ketcher("value"),
)


def server(input, output, session):
    @render_shiny_ketcher
    def value():
        print("Calculating value")
        return input.color()


app = App(app_ui, server, debug=True)
