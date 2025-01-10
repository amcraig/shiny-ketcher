# pyright: basic

from shiny import App, reactive, render, req, ui
from shiny_ketcher import (
    ketcher_message_handlers,
    output_ketcher,
    render_ketcher,
)

app_ui = ui.page_fluid(
    ketcher_message_handlers(),
    ui.h2("Ketcher"),
    output_ketcher("ketcher"),
    ui.input_text("smiles", "SMILES", "c1ccccc1"),
    ui.input_action_button("kbutton", "Click me to get SVG"),
    ui.output_ui("display_svg"),
)


def server(input, output, session):  # noqa: A002
    @render.ui
    def display_svg():
        return ui.HTML(req(input.svg()))

    @reactive.Effect
    @reactive.event(input.kbutton)
    async def _():
        await session.send_custom_message("get_svg", {"msg": "Hello, world!"})

    @render_ketcher
    def ketcher():
        return input.smiles()


app = App(app_ui, server, debug=True)
