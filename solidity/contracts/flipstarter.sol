// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.7;

contract flipstarter {
    // stracts
    struct recipientStruct {
        address _address;
        string name;
        string website;
        string photo;
        // uint256 amount; TODO: support more than one recipient
        // bool exists; TODO: support more than one recipient
    }

    struct campaignStruct {
        string title;
        string summary;
        string proposal;
    }

    struct trackStruct {
        string title;
        bool done;
    }

    struct contributor {
        address _address;
        string name;
        string comment;
        uint256 amount;
        bool withdrawn;
        bool exists;
    }

    // contributors
    mapping(address => contributor) public contributors;
    address[] public contributorsKeys;

    // events of contract
    event updateCampaign();
    event compleateCampaign();
    event updateTracks();

    //
    trackStruct[] tracks;

    address public owner;
    bool public isEnd = false;
    uint256 public goal;

    recipientStruct[] public recipients;
    campaignStruct public campaign;

    constructor(
        //
        string memory title,
        string memory summary,
        string memory proposal,
        uint256 _goal,
        //
        string memory name,
        string memory website,
        string memory photo
    ) {
        owner = msg.sender;
        recipients.push(
            recipientStruct(
                msg.sender, // first recipient in creator of camp
                name,
                website,
                photo
            )
        );
        campaign = campaignStruct(title, summary, proposal);
        goal = _goal;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    function pledge(string memory name, string memory comment) public payable {
        uint256 value = msg.value;
        require(!isEnd, "campaign was ended");
        require(
            value > 0 || contributors[msg.sender].exists,
            "Value must be more then zero"
        );
        require(bytes(name).length != 0, "Name must be not empty");
        require(address(this).balance <= goal, "The value more then goal");

        if (address(this).balance == goal) {
            isEnd = true;
        }

        if (contributors[msg.sender].exists) {
            contributors[msg.sender].name = name;
            contributors[msg.sender].comment = comment;
            contributors[msg.sender].amount += value;
            contributors[msg.sender].withdrawn = false;
            emit updateCampaign();
            return;
        }

        contributorsKeys.push(msg.sender);
        contributors[msg.sender] = contributor(
            msg.sender, // Address
            name, // name
            comment, // Comment
            value, // amount
            false, // withdrawn
            true // exists
        );
        emit updateCampaign();
    }

    function cancelPledge() public payable {
        require(!isEnd, "campaign was ended");
        require(contributors[msg.sender].exists);

        // return mony for pledger
        payable(msg.sender).transfer(contributors[msg.sender].amount);

        // delete from contributors
        contributors[msg.sender].amount = 0;
        contributors[msg.sender].name = "";
        contributors[msg.sender].comment = "";
        contributors[msg.sender].withdrawn = true;

        //
        emit updateCampaign();
    }

    function getRecipients() public view returns (recipientStruct[] memory) {
        return recipients;
    }

    function getContributor(address _address)
        public
        view
        returns (contributor memory)
    {
        contributor memory senderData = contributors[_address];
        require(senderData.exists, "This address are not contributor");
        return senderData;
    }

    function getContributor() public view returns (contributor memory) {
        return getContributor(msg.sender);
    }

    function getContributorsKeys() public view returns (address[] memory) {
        return contributorsKeys;
    }

    function getAmount() public view returns (uint256) {
        if (isEnd) {
            return goal;
        }
        return address(this).balance;
    }

    function addTrack(string memory track) public isOwner {
        require(bytes(track).length != 0, "Name must be not empty");
        tracks.push(trackStruct(track, false));
        emit updateTracks();
    }

    function switchTrack(uint256 index, bool done) public isOwner {
        require(index <= tracks.length);
        tracks[index].done = done;
        emit updateTracks();
    }

    function removeTrack(uint256 index) public isOwner {
        delete tracks[index];
        emit updateTracks();
    }

    function getTrack(uint256 index) public view returns (trackStruct memory) {
        return tracks[index];
    }

    function getTracksArray() public view returns (trackStruct[] memory) {
        return tracks;
    }

    function withdraw() public payable isOwner {
        if (address(this).balance == goal) {
            isEnd = true;
        }
        require(address(this).balance != 0, "No mony in contract");
        require(isEnd, "campaign not end");
        payable(owner).transfer(address(this).balance);
    }

    function forse() public payable isOwner {
        require(address(this).balance != 0, "No mony in contract");
        payable(owner).transfer(address(this).balance);
    }

    function balance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {
        pledge("anonymous", "");
    }
}
