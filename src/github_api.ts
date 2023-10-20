import * as core from "@actions/core"
import * as github from "@actions/github"

const getOctokitClient = () => {
    const token = core.getInput("github-token", { required: true })
    return github.getOctokit(token)
}

export const getTagsForReference = async (
    tagPrefix: string,
    owner: string,
    repo: string
): Promise<string[]> => {
    const client = getOctokitClient()
    let result = await client.request(
        "GET /repos/{owner}/{repo}/git/matching-refs/{ref}",
        {
            owner,
            repo,
            ref: `tags/${tagPrefix}`
        }
    )

    return result.data.map(res => res.ref.replace("refs/tags/", "")) // refs/tags/vehicles-service/v1.0.0
}
