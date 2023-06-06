<div>
<button onClick={() => setSearchOpen(!searchOpen)}>
  {searchOpen ? "Fermer la recherche" : "Rechercher"}
</button>
{searchOpen && (
  <SearchIntervention
    setFilteredInterventions={setFilteredInterventions}
  />
)}
{filteredInterventions.map((intervention) => (
  <Intervention key={intervention._id} intervention={intervention} />
))}
</div>