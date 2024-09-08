import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:3000/api";
const IMAGE_URL = "http://localhost:3000/images";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPokemon = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/pokemon?page=${page}`);
      console.log("Fetched Pokemon:", response);
      setPokemon(response.data.pokemon || []);
      setFilteredPokemon(response.data.pokemon || []);
      setCurrentPage(response.data.currentPage || 1);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
      setPokemon([]);
      setFilteredPokemon([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  useEffect(() => {
    const filtered = pokemon.filter((p) =>
      p.name.english.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemon(filtered);
  }, [searchTerm, pokemon]);

  const handlePokemonClick = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/pokemon/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPokemon(response.data);
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username: e.target.username.value,
        password: e.target.password.value,
      });
      const newToken = response.data.token;
      setToken(newToken);
      localStorage.setItem("token", newToken);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setSelectedPokemon(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchPokemon(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchPokemon(currentPage - 1);
    }
  };

  return (
    <div className="pokedex-container">
      <div className="pokedex">
        <div className="pokedex-left">
          <div className="pokedex-left-top">
            <div className="light-container">
              <div className="light is-sky is-big" />
              <div className="light is-red" />
              <div className="light is-yellow" />
              <div className="light is-green" />
            </div>
          </div>
          <div className="pokedex-screen-container">
            {selectedPokemon ? (
              <div className="pokemon-details">
                <h2>{selectedPokemon.name.english}</h2>
                <img
                  src={`${IMAGE_URL}/${selectedPokemon.id}.png`}
                  alt={selectedPokemon.name.english}
                  className="pokemon-image"
                />
                <p>Type: {selectedPokemon.type.join(", ")}</p>
                <h3>Base Stats:</h3>
                <ul>
                  {Object.entries(selectedPokemon.base).map(([stat, value]) => (
                    <li key={stat}>
                      {stat}:{" "}
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : value}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="pokedex-screen">
                <div className="screen-content">
                  Select a Pokémon to view details
                </div>
              </div>
            )}
          </div>
          <div className="pokedex-left-bottom">
            <div className="blue-button" />
            <div className="green-button" />
            <div className="orange-button" />
          </div>
        </div>
        <div className="pokedex-right">
          {token ? (
            <>
              <div className="pokedex-right-header">
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
                <input
                  type="text"
                  placeholder="Search Pokémon"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
              </div>
              <div className="pokemon-list">
                {isLoading ? (
                  <p>Loading...</p>
                ) : filteredPokemon.length > 0 ? (
                  filteredPokemon.map((p) => (
                    <div
                      key={`${p.id}-${p.name.english}`}
                      className="pokemon-item"
                      onClick={() => handlePokemonClick(p.id)}
                    >
                      <img
                        src={`${IMAGE_URL}/${p.id}.png`}
                        alt={p.name.english}
                        className="pokemon-list-image"
                      />
                      <span className="pokemon-item-name">
                        {p.name.english}
                      </span>
                    </div>
                  ))
                ) : (
                  <p>No Pokémon found</p>
                )}
              </div>
              <div className="pagination-controls">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  Previous
                </button>
                <span className="page-indicator">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="login-form">
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
                <button type="submit">Login</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
