"use client";

import Link from 'next/link';
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function Portfolio() {
  const [contributionsByYear, setContributionsByYear] = useState<any[]>([]);
  const [repos, setRepos] = useState<any[]>([]);
  const [languages, setLanguages] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const colors = ["#d86d65", "#295db9", "#977dbe", "#e8c591", "#9966ff", "#ff9f40"];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [maxNameLength, setMaxNameLength] = useState(0);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchContributionYears = async () => {
      try {
        const response = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          },
          body: JSON.stringify({
            query: `
              {
                user(login: "AleaChlodnik") {
                  contributionsCollection {
                    contributionYears
                  }
                }
              }
            `,
          }),
        });

        const data = await response.json();

        if (data?.data?.user?.contributionsCollection?.contributionYears) {
          const years: number[] = data.data.user.contributionsCollection.contributionYears;
          fetchContributionsByYear(years);
        } else {
          throw new Error("Failed to fetch contribution years.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching contribution years.");
      }
    };

    const fetchContributionsByYear = async (years: number[]) => {
      try {
        const contributionsData = await Promise.all(
          years.map(async (year) => {
            const response = await fetch("https://api.github.com/graphql", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
              },
              body: JSON.stringify({
                query: `
                  {
                    user(login: "AleaChlodnik") {
                      contributionsCollection(from: "${year}-01-01T00:00:00Z", to: "${year}-12-31T23:59:59Z") {
                        totalCommitContributions
                      }
                    }
                  }
                `,
              }),
            });

            const data = await response.json();
            return {
              year,
              contributions: data?.data?.user?.contributionsCollection?.totalCommitContributions || 0,
            };
          })
        );

        setContributionsByYear(contributionsData);
      } catch (err) {
        console.error(err);
        setError("Error fetching contributions per year.");
      }
    };

    fetchContributionYears();

    const fetchRepos = async () => {
      try {
        const res = await fetch("https://api.github.com/users/AleaChlodnik/repos", {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        const responseText = await res.text();

        if (res.status === 403) {
          console.error("GitHub API rate limit exceeded or token invalid:", res);
          setError("GitHub API rate limit exceeded. Try again later.");
          return;
        }

        const reposData = JSON.parse(responseText);

        if (!Array.isArray(reposData)) {
          throw new Error("Unexpected response format: " + JSON.stringify(reposData));
        }
        setRepos(reposData);

        const languageSet = new Set<string>();
        await Promise.all(
          reposData.map(async (repo: any) => {
            if (!repo.languages_url) return;

            try {
              const langRes = await fetch(repo.languages_url, {
                headers: {
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
                },
              });

              if (!langRes.ok) {
                console.warn(`Skipping ${repo.name}: Failed to fetch languages (status ${langRes.status})`);
                return;
              }

              const langData = await langRes.json();
              Object.keys(langData).forEach((lang) => languageSet.add(lang));
            } catch (err) {
              console.error(`Error fetching languages for ${repo.name}:`, err);
            }
          })
        );

        setLanguages(languageSet);
      } catch (error) {
        console.error("Error fetching public repos or languages:", error);
        setError("Error fetching public repositories or languages.");
      }
    };

    fetchRepos();
  }, []);

  const pieChartData = contributionsByYear.map((yearData: any) => ({
    name: yearData.year.toString(),
    value: yearData.contributions,
  }));

  useEffect(() => {
    if (repos.length > 0) {
      const length = Math.max(...repos.map((repo) => repo.name.length));
      setMaxNameLength(length);
    }
  }, [repos]);

  return (
    <div className="w-full min-h-screen bg-cover pt-[5%] px-[2%]" style={{ backgroundImage: 'url(/portfolio_bg.jpg)' }}>
      <div className="flex flex-row gap-[2%]">
        <div className="flex flex-col justify-center items-center gap-8 w-fit h-fit bg-white bg-opacity-80 rounded-3xl px-5 pt-7 pb-5">
          <Link href="https://github.com/AleaChlodnik">
            <img src="/github_icon.png" alt="GitHub" className="w-[5vw] h-fit rounded-full cursor-pointer shadow-2xl hover:scale-105 transition-transform" />
          </Link>
          <Link href="https://www.linkedin.com/in/alea-chlodnik-589615268/">
            <img src="/linkedin_icon.png" alt="LinkedIn" className="w-[5vw] h-fit rounded-full cursor-pointer shadow-2xl hover:scale-105 transition-transform" />
          </Link>

          <div className="relative">
            <button onClick={toggleDropdown} className="w-[5vw] h-fit rounded-full cursor-pointer shadow-2xl hover:scale-105 transition-transform">
              <img src="/email_icon.png" alt="Email" />
            </button>
            {dropdownOpen && (
              <div className="absolute bg-white shadow-lg rounded-md p-2 mt-2">
                <Link
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=alea.chlodnik@epitech.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 hover:bg-gray-200"
                >
                  Gmail
                </Link>
                <Link
                  href="https://outlook.office.com/mail/deeplink/compose?to=alea.chlodnik@epitech.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 hover:bg-gray-200"
                >
                  Outlook
                </Link>
                <Link
                  href="https://compose.mail.yahoo.com/?to=alea.chlodnik@epitech.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 hover:bg-gray-200"
                >
                  Yahoo
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5 py-8 w-full bg-white bg-opacity-80 rounded-3xl">
          <h1 className="text-7xl font-extrabold w-full text-center text-white" style={{ textShadow: "2px 2px 0px rgb(183,138,106), -2px -2px 0px rgb(183,138,106), 2px -2px 0px rgb(183,138,106), -2px 2px 0px rgb(183,138,106)" }}>My Portfolio</h1>
          <div className="flex flex-row items-end w-full px-10">
            <div className="w-fit">
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : contributionsByYear.length === 0 ? (
                <p>Loading contributions...</p>
              ) : (
                <PieChart width={500} height={400}>
                  <Pie
                    data={contributionsByYear}
                    dataKey="contributions"
                    nameKey="year"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {contributionsByYear.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              )}
              <h2 className="text-2xl font-semibold text-center text-[#b78a6a]">Contributions per Year</h2>
            </div>

            <div className="flex flex-col items-end gap-5 w-full h-full pr-5">
              <h2 className="text-4xl font-bold text-[#b78a6a] pr-8"><u>Projects</u></h2>
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : repos.length === 0 ? (
                <p>Loading repositories...</p>
              ) : (
                <div className="flex flex-wrap justify-end gap-12">
                  {repos.map((repo) => {
                    const width = `${maxNameLength * 1.4}vw`;
                    return (
                      <Link key={repo.id} href={repo.html_url}>
                        <div className="rounded-full shadow-2xl text-5xl text-white text-center font-semibold bg-[#b78a6a] h-fit hover:scale-105 transition-transform py-5" style={{ width }}>
                          {repo.name}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          <div className="flex flex-col justify-center items-center w-full">
            <h2 className="text-2xl font-semibold">Technology Used</h2>
            <p>{[...languages].length ? [...languages].join(", ") : "Loading..."}</p>
          </div>
        </div>
      </div>

      <div className="w-fit">
        <iframe
          src="/AleaChlodnik-CV-fr.pdf"
          className="w-full border rounded-lg shadow-lg"
        ></iframe>

        <a
          href="/AleaChlodnik-CV-fr.pdf"
          download="AleaChlodnik-CV-fr.pdf"
          className="bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          📥 Download Resume
        </a>
      </div>
    </div>
  );
}
