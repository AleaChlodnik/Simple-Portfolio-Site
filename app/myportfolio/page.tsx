"use client";

import Link from 'next/link';
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts"; // Importing necessary components from recharts

export default function Portfolio() {
  const [contributionsByYear, setContributionsByYear] = useState<any[]>([]);
  const [repos, setRepos] = useState<any[]>([]);
  const [languages, setLanguages] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch GitHub Contributions
    fetch("https://api.github.com/graphql", {
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
                    contributionCalendar {
                      years {
                        year
                        totalContributions
                      }
                    }
                  }
                }
              }
            `,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("GitHub Contributions Data:", data); ///////////////////////////////
      if (data?.data?.user?.contributionsCollection?.contributionCalendar?.years) {
        const yearsData = data.data.user.contributionsCollection.contributionCalendar.years;
        setContributionsByYear(yearsData);
      } else {
        console.error("Failed to fetch contributions: Data structure not as expected.");
        setError("Failed to fetch contributions.");
      }
    })
    .catch((error) => {
      console.error("Error fetching GitHub contributions:", error);
      setError("Error fetching contributions.");
    });

    const fetchRepos = async () => {
      try {
        const res = await fetch("https://api.github.com/users/AleaChlodnik/repos");
        const reposData = await res.json();
        setRepos(reposData);

        const languageSet = new Set<string>();
        await Promise.all(
          reposData.map(async (repo: any) => {
            if (repo.languages_url) {
              const langRes = await fetch(repo.languages_url);
              const langData = await langRes.json();
              Object.keys(langData).forEach((lang) => languageSet.add(lang));
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

  // Pie chart data (example)
  const pieChartData = contributionsByYear.map((yearData: any) => ({
    name: yearData.year.toString(),
    value: yearData.totalContributions,
  }));

  return (
    <div className="relative flex flex-row h-screen w-full bg-cover bg-center px-6" style={{ backgroundImage: 'url(/portfolio_bg.jpg)' }}>
      <div className="absolute left-10 top-[20%] transform -translate-y-1/2 flex flex-col gap-5 w-fit bg-white bg-opacity-80 rounded-3xl p-5 shadow-lg">
        <Link href="https://github.com/AleaChlodnik">
          <img src="/github_icon.png" alt="GitHub" className="w-24 h-24 rounded-full cursor-pointer hover:scale-105 transition-transform" />
        </Link>
        <Link href="https://www.linkedin.com/in/alea-chlodnik-589615268/">
          <img src="/linkedin_icon.png" alt="LinkedIn" className="w-24 h-24 rounded-full cursor-pointer hover:scale-105 transition-transform" />
        </Link>
      </div>

      <div className="absolute left-[12%] top-[10%] flex flex-col gap-5 min-w-[84%] bg-white bg-opacity-80 rounded-3xl p-5 shadow-lg">

        {/* Skills Section */}
        <div>
          <h2 className="text-2xl font-semibold">Skills</h2>
          <p>{[...languages].length ? [...languages].join(", ") : "Loading..."}</p>
        </div>

        {/* Pie Chart Section */}
        <div>
          <h2 className="text-2xl font-semibold">Contributions</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'][index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Projects Section */}
        <div>
          <h2 className="text-2xl font-semibold">Projects</h2>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : repos.length === 0 ? (
            <p>Loading repositories...</p>
          ) : (
            <ul>
              {repos.map((repo) => (
                <li key={repo.id}>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
