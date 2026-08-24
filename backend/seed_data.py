import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from api.destinations.models import Destination
from api.categories.models import Category
from api.packages.models import TourPackage, ItineraryItem
from api.bookings.models import Booking
from api.blogs.models import BlogArticle

User = get_user_model()

def run_seed():
    print("[+] Starting Explore Getaway database seeding...")

    # Create Users
    admin_user, created = User.objects.get_or_create(
        username="admin",
        defaults={
            "email": "admin@exploregetaway.com",
            "first_name": "Admin",
            "last_name": "Manager",
            "role": "admin",
            "is_staff": True,
            "is_superuser": True,
        }
    )
    if created or not admin_user.check_password("admin123"):
        admin_user.set_password("admin123")
        admin_user.save()
        print("  -> Admin user created/updated: username='admin', password='admin123'")

    demo_user, created = User.objects.get_or_create(
        username="user",
        defaults={
            "email": "traveler@example.com",
            "first_name": "Aarav",
            "last_name": "Sharma",
            "role": "user",
            "phone": "+91 98765 43210",
        }
    )
    if created or not demo_user.check_password("password123"):
        demo_user.set_password("password123")
        demo_user.save()
        print("  -> Demo user created/updated: username='user', password='password123'")

    # Create Categories
    categories_data = [
        {"name": "Bestseller", "slug": "bestseller"},
        {"name": "Honeymoon", "slug": "honeymoon"},
        {"name": "Group Tours", "slug": "group-tours"},
        {"name": "Family", "slug": "family"},
        {"name": "Adventure", "slug": "adventure"},
        {"name": "Island & Beaches", "slug": "island-beaches"},
    ]

    cat_map = {}
    for c_data in categories_data:
        cat, _ = Category.objects.get_or_create(slug=c_data["slug"], defaults={"name": c_data["name"]})
        cat_map[c_data["name"]] = cat
    print(f"  -> Created {len(cat_map)} categories.")

    # Create Destinations
    destinations_data = [
        {
            "name": "Leh Ladakh", "slug": "leh-ladakh", "subtitle": "Land of High Passes",
            "image_url": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
            "description": "Experience breathtaking high-altitude mountain passes, serene azure lakes, and ancient Tibetan monasteries in Leh Ladakh."
        },
        {
            "name": "Kashmir", "slug": "kashmir", "subtitle": "Paradise on Earth",
            "image_url": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
            "description": "Gliding on a Shikara on Dal Lake, snow-capped peaks in Gulmarg, and lush green meadows of Pahalgam await you."
        },
        {
            "name": "Himachal Pradesh", "slug": "himachal-pradesh", "subtitle": "The Land of Gods",
            "image_url": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
            "description": "Explore alpine valleys, coniferous forests, cascading waterfalls, and vibrant hill resorts in Manali and Shimla."
        },
        {
            "name": "Rajasthan", "slug": "rajasthan", "subtitle": "The Royal Heritage",
            "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
            "description": "Step into royal palaces, desert dunes, grand hill forts, and rich cultural traditions across Jaipur, Udaipur and Jaisalmer."
        },
        {
            "name": "Kerala", "slug": "kerala", "subtitle": "God's Own Country",
            "image_url": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
            "description": "Cruise through peaceful backwaters on houseboats, stroll past mist-covered tea plantations in Munnar, and relax on pristine palm beaches."
        },
        {
            "name": "Uttarakhand", "slug": "uttarakhand", "subtitle": "Devbhumi",
            "image_url": "https://images.unsplash.com/photo-1626714494903-8d022b72449c?auto=format&fit=crop&w=800&q=80",
            "description": "Spiritual ghats in Rishikesh, skiing slopes in Auli, and serene lakes in Nainital nestled under Himalayan peaks."
        },
        {
            "name": "Andaman", "slug": "andaman", "subtitle": "Tropical Paradise",
            "image_url": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80",
            "description": "Crystal blue ocean waters, white sand beaches on Havelock Island, vibrant scuba diving coral reefs, and sunset cruises."
        },
        {
            "name": "Goa", "slug": "goa", "subtitle": "Sun, Sand & Susegad",
            "image_url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
            "description": "Golden beaches, vibrant nightlife, Portuguese colonial architecture, water sports, and beach shacks."
        },
        {
            "name": "Meghalaya", "slug": "meghalaya", "subtitle": "Abode of Clouds",
            "image_url": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
            "description": "Living root bridges in Cherrapunji, crystal clear river waters in Dawki, and dramatic waterfalls surrounding Shillong."
        },
        {
            "name": "Sikkim", "slug": "sikkim", "subtitle": "Himalayan Jewel",
            "image_url": "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
            "description": "Panoramas of Kanchenjunga mountain, sacred alpine lakes, Buddhist monasteries, and organic mountain tea gardens."
        },
    ]

    dest_map = {}
    for d_data in destinations_data:
        dest, _ = Destination.objects.get_or_create(
            slug=d_data["slug"],
            defaults={
                "name": d_data["name"],
                "subtitle": d_data["subtitle"],
                "image_url": d_data["image_url"],
                "description": d_data["description"],
                "is_popular": True,
            }
        )
        dest_map[d_data["name"]] = dest
    print(f"  -> Created {len(dest_map)} destinations.")

    # Create Tour Packages
    packages_data = [
        {
            "title": "Leh Ladakh Explorer",
            "slug": "leh-ladakh-explorer",
            "destination": dest_map["Leh Ladakh"],
            "category": cat_map["Bestseller"],
            "duration_nights": 5,
            "duration_days": 6,
            "location_summary": "Leh, Nubra, Pangong, Tso Moriri",
            "price_per_person": 18999,
            "original_price": 23999,
            "rating": 4.8,
            "reviews_count": 214,
            "badge_text": "BEST SELLER",
            "image_url": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
            "gallery": [
                {"url": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80", "description": "Pangong Tso at first light"},
                {"url": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80", "description": "Shanti Stupa & Leh Palace"}
            ],
            "highlights": [
                "Cross Khardung La — one of the world's highest motorable roads",
                "Overnight stay in luxury dome tents near Pangong Lake",
                "Camel safari on double-humped Bactrian camels in Hunder sand dunes",
                "Visit iconic Thiksey and Hemis monasteries"
            ],
            "inclusions": [
                "Airport transfers in Leh",
                "5 Nights Deluxe accommodation",
                "Daily Breakfast & Dinner",
                "Inner line permits & Oxygen cylinder support",
                "Dedicated Non-AC Innova/Tempo Traveler"
            ],
            "exclusions": [
                "Airfare / Train fare",
                "Personal expenses and monument entry fees",
                "Camel ride fee"
            ],
            "is_bestseller": True,
            "is_trending": True,
            "itinerary": [
                {"day_number": 1, "title": "Arrival in Leh & Acclimatization", "description": "Arrive at Kushok Bakula Rimpochee Airport, Leh. Transfer to hotel. Rest complete day to get accustomed to high altitude. Evening walk to Leh Market and Shanti Stupa."},
                {"day_number": 2, "title": "Leh Sightseeing & Monasteries", "description": "Post breakfast, visit Hall of Fame, Magnetic Hill, Confluence of Zanskar & Indus rivers, and Spituk Monastery."},
                {"day_number": 3, "title": "Leh to Nubra Valley via Khardung La", "description": "Drive over Khardung La pass (17,582 ft). Arrive at Hunder in Nubra Valley. Enjoy camel ride on sand dunes and check into hotel/tent."},
                {"day_number": 4, "title": "Nubra Valley to Pangong Lake via Shyok", "description": "Drive alongside Shyok River reaching Pangong Lake. Admire the changing colors of the pristine lake at sunset."},
                {"day_number": 5, "title": "Pangong Lake to Leh via Chang La", "description": "Witness morning sunrise at Pangong. Drive back to Leh crossing Chang La pass. Visit Thiksey Monastery en route."},
                {"day_number": 6, "title": "Departure from Leh", "description": "Transfer to Leh airport with unforgettable memories of Ladakh."}
            ]
        },
        {
            "title": "Kashmir Paradise Valley Tour",
            "slug": "kashmir-paradise",
            "destination": dest_map["Kashmir"],
            "category": cat_map["Honeymoon"],
            "duration_nights": 4,
            "duration_days": 5,
            "location_summary": "Srinagar, Gulmarg, Pahalgam",
            "price_per_person": 16999,
            "original_price": 20999,
            "rating": 4.7,
            "reviews_count": 178,
            "badge_text": "POPULAR",
            "image_url": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
            "gallery": [
                {"url": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80", "description": "Scenic Shikara Ride on Dal Lake"}
            ],
            "highlights": [
                "Complimentary 1-hour Shikara Ride on Dal Lake",
                "1 Night stay in a traditional wooden Houseboat",
                "Gondola Cable Car Ride in snow-covered Gulmarg",
                "Explore Betaab Valley and Aru Valley in Pahalgam"
            ],
            "inclusions": [
                "3 Nights Hotel + 1 Night Deluxe Houseboat Stay",
                "Daily Breakfast & Dinner",
                "Private Vehicle for all transfers & sightseeing",
                "Shikara ride on Dal Lake"
            ],
            "exclusions": [
                "Gondola ride tickets",
                "Pony rides in Pahalgam/Gulmarg",
                "Personal expenses"
            ],
            "is_bestseller": True,
            "is_trending": False,
            "itinerary": [
                {"day_number": 1, "title": "Arrival in Srinagar & Shikara Ride", "description": "Welcome to Srinagar. Check in to Deluxe Houseboat on Dal Lake. Enjoy evening Shikara ride."},
                {"day_number": 2, "title": "Srinagar to Gulmarg Day Trip", "description": "Excursion to Gulmarg. Take the world famous Gondola cable car ride to Apharwat peak."},
                {"day_number": 3, "title": "Srinagar to Pahalgam (Valley of Shepherds)", "description": "Drive to Pahalgam visiting Saffron fields and Avantipur ruins along Lidder River."},
                {"day_number": 4, "title": "Pahalgam Valley Exploration & Srinagar Return", "description": "Visit Betaab Valley, Chandanwari, and Aru Valley. Return to Srinagar hotel in evening."},
                {"day_number": 5, "title": "Mughal Gardens Sightseeing & Departure", "description": "Visit Shalimar Bagh, Nishat Bagh, and Chashme Shahi gardens before heading to airport."}
            ]
        },
        {
            "title": "Himachal Alpine Getaway",
            "slug": "himachal-getaway",
            "destination": dest_map["Himachal Pradesh"],
            "category": cat_map["Group Tours"],
            "duration_nights": 3,
            "duration_days": 4,
            "location_summary": "Manali, Solang Valley, Shimla",
            "price_per_person": 12999,
            "original_price": 15999,
            "rating": 4.6,
            "reviews_count": 143,
            "badge_text": "TRENDING",
            "image_url": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
            "gallery": [],
            "highlights": [
                "Solang Valley adventure sports & snow activities",
                "Visit Hadimba Temple and Vashisht Hot Springs",
                "Stroll along Mall Road Shimla and Ridge"
            ],
            "inclusions": [
                "3 Nights 3-Star Hotel Stay",
                "Breakfast & Dinner",
                "Sightseeing in Volvo AC Coach"
            ],
            "exclusions": ["Adventure activities tickets", "Lunch"],
            "is_bestseller": False,
            "is_trending": True,
            "itinerary": [
                {"day_number": 1, "title": "Arrival in Manali & Local Sightseeing", "description": "Arrive in Manali. Visit Hadimba Temple, Club House, and Vashisht Village."},
                {"day_number": 2, "title": "Solang Valley Adventure Excursion", "description": "Full day excursion to Solang Valley for paragliding, zorbing, and cable car rides."},
                {"day_number": 3, "title": "Manali to Shimla scenic drive", "description": "Drive through Kullu Valley visiting Rafting point and Shawl factories."},
                {"day_number": 4, "title": "Shimla Sightseeing & Departure", "description": "Visit Ridge, Mall Road, and Jakhoo Temple before departing."}
            ]
        },
        {
            "title": "Royal Rajasthan Heritage Journey",
            "slug": "rajasthan-heritage",
            "destination": dest_map["Rajasthan"],
            "category": cat_map["Family"],
            "duration_nights": 5,
            "duration_days": 6,
            "location_summary": "Jaipur, Jodhpur, Udaipur, Jaisalmer",
            "price_per_person": 17999,
            "original_price": 22999,
            "rating": 4.7,
            "reviews_count": 196,
            "badge_text": "GREAT DEAL",
            "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
            "gallery": [],
            "highlights": [
                "Elephant ride at Amber Fort Jaipur",
                "Desert safari & Folk music night in Jaisalmer dunes",
                "Boat ride on Lake Pichola in Udaipur"
            ],
            "inclusions": [
                "5 Nights Heritage Stays & Desert Camp",
                "Daily Breakfast & Dinner",
                "AC Private Cab for 6 Days"
            ],
            "exclusions": ["Monument entry charges", "Personal tips"],
            "is_bestseller": True,
            "is_trending": False,
            "itinerary": [
                {"day_number": 1, "title": "Pink City Jaipur Arrival", "description": "Arrive Jaipur. Visit Hawa Mahal, City Palace, and Jantar Mantar."},
                {"day_number": 2, "title": "Amber Fort & Drive to Jodhpur", "description": "Morning Amber Fort visit. Drive to Blue City Jodhpur in afternoon."},
                {"day_number": 3, "title": "Jodhpur to Jaisalmer Desert Dunes", "description": "Visit Mehrangarh Fort. Drive to Jaisalmer desert camp for camel safari & folk dance."},
                {"day_number": 4, "title": "Golden City Jaisalmer Fort", "description": "Explore Jaisalmer Fort, Patwon ki Haveli, and Gadisar Lake."},
                {"day_number": 5, "title": "Drive to Udaipur (City of Lakes)", "description": "Drive to Udaipur visiting Ranakpur Jain Temple en route."},
                {"day_number": 6, "title": "Udaipur Sightseeing & Departure", "description": "Visit City Palace and Lake Pichola before heading to airport."}
            ]
        },
        {
            "title": "Kerala Backwater Bliss",
            "slug": "kerala-backwater-bliss",
            "destination": dest_map["Kerala"],
            "category": cat_map["Honeymoon"],
            "duration_nights": 4,
            "duration_days": 5,
            "location_summary": "Munnar, Thekkady, Alleppey, Kochi",
            "price_per_person": 15499,
            "original_price": 18999,
            "rating": 4.8,
            "reviews_count": 231,
            "badge_text": "HONEYMOON",
            "image_url": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
            "gallery": [],
            "highlights": [
                "Private Deluxe Houseboat cruise with freshly prepared Keralite meals",
                "Visit Tea Museum and Mattupetty Dam in Munnar",
                "Spice plantation walk and Kathakali cultural show"
            ],
            "inclusions": [
                "3 Nights Resort Stay + 1 Night Private Houseboat",
                "All Meals on Houseboat & Breakfast at Resorts",
                "Private AC Sedan vehicle"
            ],
            "exclusions": ["Airfare", "Personal expenses"],
            "is_bestseller": True,
            "is_trending": True,
            "itinerary": [
                {"day_number": 1, "title": "Arrival in Kochi & Transfer to Munnar", "description": "Pick up from Kochi airport. Scenic drive to Munnar past Cheeyappara Waterfalls."},
                {"day_number": 2, "title": "Munnar Tea Gardens Exploration", "description": "Visit Eravikulam National Park (Nilgiri Tahr), Tea Museum, and Echo Point."},
                {"day_number": 3, "title": "Munnar to Thekkady Spice Hills", "description": "Drive to Thekkady. Enjoy spice plantation tour and Periyar Lake boat ride."},
                {"day_number": 4, "title": "Thekkady to Alleppey Houseboat", "description": "Board private houseboat in Alleppey backwaters. Sail through narrow canals at sunset."},
                {"day_number": 5, "title": "Houseboat Check-out & Kochi Departure", "description": "Visit Fort Kochi Chinese Fishing Nets before flight departure."}
            ]
        },
        {
            "title": "Andaman Island Escape",
            "slug": "andaman-island-escape",
            "destination": dest_map["Andaman"],
            "category": cat_map["Island & Beaches"],
            "duration_nights": 5,
            "duration_days": 6,
            "location_summary": "Port Blair, Havelock, Neil Island",
            "price_per_person": 24999,
            "original_price": 29999,
            "rating": 4.9,
            "reviews_count": 154,
            "badge_text": "ISLAND",
            "image_url": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80",
            "gallery": [],
            "highlights": [
                "Catamaran cruise to Havelock Island",
                "Visit Asia's famous Radhanagar Beach",
                "Light & Sound Show at Cellular Jail, Port Blair"
            ],
            "inclusions": [
                "5 Nights Island Resort Stay",
                "Daily Breakfast",
                "Inter-island ferry tickets (Makruzz/Green Ocean)",
                "All transfers in private vehicle"
            ],
            "exclusions": ["Scuba diving fee", "Lunch & Dinner"],
            "is_bestseller": False,
            "is_trending": True,
            "itinerary": [
                {"day_number": 1, "title": "Arrival Port Blair & Cellular Jail", "description": "Arrive Port Blair. Check in to hotel. Visit Cellular Jail and attend Light & Sound show."},
                {"day_number": 2, "title": "Port Blair to Havelock Island Ferry", "description": "Take high speed catamaran ferry to Havelock. Relax at Radhanagar Beach sunset."},
                {"day_number": 3, "title": "Elephant Beach Snorkeling Excursion", "description": "Speedboat ride to Elephant Beach for water sports and snorkeling."},
                {"day_number": 4, "title": "Havelock to Neil Island", "description": "Ferry to Neil Island. Visit Bharatpur Beach and Natural Coral Bridge."},
                {"day_number": 5, "title": "Neil Island to Port Blair Return", "description": "Return ferry to Port Blair. Visit Chidiyatapu sunset point."},
                {"day_number": 6, "title": "Departure from Port Blair", "description": "Transfer to Veer Savarkar Airport."}
            ]
        }
    ]

    for p_data in packages_data:
        itinerary_data = p_data.pop("itinerary", [])
        if "original_price" in p_data:
            p_data["old_price"] = p_data["original_price"]
        pkg, _ = TourPackage.objects.get_or_create(
            slug=p_data["slug"],
            defaults=p_data
        )
        if not pkg.itinerary.exists():
            for item in itinerary_data:
                ItineraryItem.objects.create(package=pkg, **item)
    print(f"  -> Created {len(packages_data)} tour packages with itineraries.")

    # Create Blog Articles
    blogs_data = [
        {
            "title": "15 Best Places to Visit in Leh Ladakh",
            "slug": "best-places-leh-ladakh",
            "summary": "From Pangong Tso lake to the ancient Hemis monastery — discover the surreal destinations that make a Ladakh expedition unforgettable.",
            "content": "Leh Ladakh is a dream destination for travelers worldwide. Nestled between the Himalayas and Karakoram ranges, this high-altitude region offers landscapes unlike anywhere else on earth...",
            "image_url": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
            "author": "Admin"
        },
        {
            "title": "Complete Travel Guide for a Kashmir Trip",
            "slug": "kashmir-travel-guide",
            "summary": "When to go, what to pack, and how to plan the perfect five-day valley itinerary across Srinagar, Gulmarg, and Pahalgam.",
            "content": "Kashmir is poetically termed 'Paradise on Earth'. Planning your trip requires understanding seasonal highlights, from springtime tulip festivals to winter snow in Gulmarg...",
            "image_url": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
            "author": "Admin"
        },
        {
            "title": "Top 10 Rajasthan Forts You Must Explore",
            "slug": "rajasthan-forts-to-explore",
            "summary": "Amber Fort, Mehrangarh, Kumbhalgarh and the desert citadels that still feel alive with royal history.",
            "content": "Rajasthan's hill forts are UNESCO World Heritage sites that tell stories of valour, architecture, and royal splendour. Walk through historic ramparts...",
            "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
            "author": "Admin"
        }
    ]

    for b_data in blogs_data:
        BlogArticle.objects.get_or_create(slug=b_data["slug"], defaults=b_data)
    print(f"  -> Created {len(blogs_data)} blog articles.")

    # Create Sample Booking for demo user
    sample_package = TourPackage.objects.first()
    if sample_package:
        Booking.objects.get_or_create(
            user=demo_user,
            package=sample_package,
            defaults={
                "travel_date": "2026-10-15",
                "guests_count": 2,
                "customer_name": "Aarav Sharma",
                "customer_email": "traveler@example.com",
                "customer_phone": "+91 98765 43210",
                "total_price": sample_package.price_per_person * 2,
                "special_requests": "Vegetarian meal preference on train/flights.",
                "status": "confirmed",
            }
        )
        print("  -> Created sample booking for demo user.")

    print("[+] Database seeding completed successfully!")

if __name__ == '__main__':
    run_seed()
