#!/bin/bash

echo "🚀 Pushing Apollo Square Hidden Attributes to GitHub..."
echo "Organization: Odyssey-Lab-LLC"
echo "Repository: apollo-square-hidden-attributes"
echo ""

# Push to GitHub
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🔗 Repository URL: https://github.com/Odyssey-Lab-LLC/apollo-square-hidden-attributes"
    echo ""
    echo "👥 Your development team can now:"
    echo "   git clone https://github.com/Odyssey-Lab-LLC/apollo-square-hidden-attributes.git"
    echo ""
else
    echo ""
    echo "❌ Push failed. Make sure you've created the repository on GitHub first:"
    echo "   1. Go to https://github.com/orgs/Odyssey-Lab-LLC/repositories"
    echo "   2. Click 'New Repository'"
    echo "   3. Name: apollo-square-hidden-attributes"
    echo "   4. Make it Public"
    echo "   5. Don't initialize with README/gitignore/license"
    echo "   6. Create Repository"
    echo "   7. Run this script again"
fi