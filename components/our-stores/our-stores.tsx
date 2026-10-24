"use client";

import { locations } from "@/data/locations";
import { YMaps, Map, Placemark } from "@iminside/react-yandex-maps";
import { useState } from "react";





const OurStores = () => {
  const [currentLocation, setCurrentLocation] = useState(locations[0]);

  // const currentCenter = currentLocation.center;

  return (
    <section>
      <YMaps
        query={{
          lang: "ru_RU",
          apikey: "1ac61b8a-843f-454f-abd8-a651a3c60f00",
        }}
       
      >
        <div>
          <h2 className="text-2xl mb-4 md:mb-8 xl:mb-10 font-bold xl:text-4xl">
            Наши магазины
          </h2>

          <div className="flex gap-4 xl:gap-8 mb-4 xl:mb-8">
            {locations.map((l) => (
              <button
                onClick={() => setCurrentLocation(l)}
                className={`py-2 px-4 rounded-sm ${l.id === currentLocation.id ? "bg-(--color-secondary) text-white" : "bg-[#F3F2F1] text-(--color-foreground) border border-(--color-foreground)"}`}
                key={l.id}
              >
                {l.title}
              </button>
            ))}
          </div>

          <Map
           modules={["geoObject.addon.hint", "geoObject.addon.balloon"]}
            width="100%"
            height="354px"
            // defaultState={{ center: currentCenter, zoom: 12 }}
            state={{ center: currentLocation.center, zoom: 12 }}
          >
            {currentLocation.stores.map((s) => (
              <Placemark
                key={s.id}
                properties={{
                  hintContent: s.name,
                  balloonContent: s.name,
                }}
                geometry={s.marker}
                options={{
                  iconLayout: "default#image",
                  iconImageHref: "/images/icons/marker.svg",
                  iconImageSize: [32, 32],
                  iconOffset: [-16, -16],
                }}
              />
            ))}
          </Map>
        </div>
      </YMaps>
    </section>
  );
};

export default OurStores;
