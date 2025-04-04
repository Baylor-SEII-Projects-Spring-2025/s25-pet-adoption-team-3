#!/bin/sh
cd ../pet-generator
python3 add-characteristics-to-db.py
python3 pet-generator.py
