# ETICS Fastener Configurator

![ETICS Fastener Configurator](https://marffinn.github.io/sf-configurator-test/preview.jpg)

A web-based configurator tool for selecting and customizing ETICS (External Thermal Insulation Composite System) fasteners, built with Salesforce Lightning Web Components (LWC) and hosted as a static site on GitHub Pages.  
This test repository demonstrates a Polish-language product configurator for **AMEX-starfix** connectors/anchors.

Live demo: https://marffinn.github.io/sf-configurator-test

## Features

- Interactive form for project parameters (wall type, insulation material & thickness, wind/load zones, etc.)
- Real-time recommendation of optimal fastener type, length, and quantity
- Visual summary of the configuration
- Responsive design – works perfectly on desktop and mobile
- Polish language (pl-PL) interface

## Technologies

- Salesforce Lightning Web Components (LWC)
- HTML5, CSS3, JavaScript (ES6+)
- Salesforce CLI for development
- GitHub Pages for static hosting

## Prerequisites

- Node.js ≥ 14 and npm (for local development)
- Git
- (Optional) Salesforce DX and a scratch org for full LWC testing

## Installation & Local Development

```bash
git clone https://github.com/marffinn/sf-configurator-test.git
cd sf-configurator-test

# Install dependencies (if any)
npm install
